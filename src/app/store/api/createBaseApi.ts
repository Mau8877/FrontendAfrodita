import { logout, setCredentials, type User } from '@/app/features/auth/store/authSlice'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import moment from 'moment'
import { jwtDecode } from "jwt-decode"
import type { RootState } from '@/app/store'
import { api as mainApi } from '@/app/store/api/api'

/**
 * ESTRUCTURA DEL TOKEN DE AFRODITA
 * exp: Timestamp de expiración (Unix)
 */
interface DecodedToken {
  exp: number
  user_id?: string
}

export type ApiConfig = {
  baseUrl: string
  authTokenPath?: string
  debug?: boolean
  timeout?: number
  apiName?: string
}

type ExtraOptionsApi = {
  unauthenticated?: boolean
}

const minutesToRefresh = 5 
let refreshPromise: Promise<{ access: string; refresh: string; user?: User }> | null = null

/**
 * FUNCIÓN AUXILIAR PARA REFRESCAR TOKENS
 * Se usa fetch puro para evitar bucles infinitos con el interceptor de la API.
 */
async function refreshTokens(refreshToken: string, baseUrl: string): Promise<{ access: string; refresh: string; user?: User }> {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  const response = await fetch(`${cleanBaseUrl}/auth/refresh/`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) throw new Error('Refresh failed')

  const json = await response.json()
  const data = json.data || json 

  return {
      access: data.access,
      refresh: data.refresh,
      user: data.user 
  }
}

/**
 * HELPER DE CIERRE FORZADO
 * Limpia Redux, Caché, LocalStorage y redirige al Login.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleForceLogout = (api: any) => {
    console.warn("🔐 Sesión terminada. Limpiando datos de Afrodita...")
    api.dispatch(logout())
    
    api.dispatch(mainApi.util.resetApiState()) 
    
    localStorage.clear()
    if (window.location.pathname !== '/login') {
        window.location.href = '/login'
    }
}

export function createBaseApi(config: ApiConfig) {
  const { baseUrl, timeout = 60000, apiName = 'API', debug = true } = config

  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    timeout,
    prepareHeaders: (headers, { getState, extra }) => {
      const { unauthenticated } = (extra as ExtraOptionsApi) || {}
      
      if (!unauthenticated) {
        const state = getState() as RootState
        const token = state.auth.token
        const sessionId = state.auth.sessionId 

        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        
        if (sessionId && typeof sessionId === 'string') {
          headers.set('X-Session-Id', sessionId)
        }
      }
      return headers
    },
  })

  const isAuthEndpoint = (url: string): boolean => {
    return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')
  }

  /**
   * LÓGICA DE AUDITORÍA DE TOKENS
   * Determina si el token está próximo a expirar (5 min antes).
   */
  const checkTokenExpiration = (token: string | null, refreshToken: string | null) => {
    if (!token || !refreshToken) return { action: 'none' as const }
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const now = moment().unix()
      const minutesUntilExpiry = (decoded.exp - now) / 60

      if (minutesUntilExpiry <= 0) return { action: 'refresh' as const, reason: 'Token expirado' }
      if (minutesUntilExpiry <= minutesToRefresh) {
        return { action: 'refresh' as const, reason: `Expira en ${Math.ceil(minutesUntilExpiry)} min` }
      }
    } catch { 
      return { action: 'logout' as const, reason: 'Token inválido' }
    }
    return { action: 'none' as const }
  }

  const baseQueryWithLogging: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions)

    const url = typeof args === 'string' ? args : args.url
    const rawStatus = result.meta?.response?.status ?? result.error?.status

    if (url.includes('/menu/sidebar/') && rawStatus === 401) {
      return result 
    }

    if (debug) {
      const url = typeof args === 'string' ? args : args.url
      const method = typeof args === 'string' ? 'GET' : args.method ?? 'GET'
      const rawStatus = result.meta?.response?.status ?? result.error?.status
      const isSuccess = typeof rawStatus === 'number' && rawStatus >= 200 && rawStatus < 300
      const color = isSuccess ? 'background: #22c55e; color: #fff' : 'background: #ef4444; color: #fff'
      
      console.groupCollapsed(`%c [${apiName}] ${method} ${rawStatus} `, color, url)
      if (result.error) console.log('Error:', result.error)
      if (result.data) console.log('Data:', result.data)
      console.groupEnd()
    }
    return result
  }

  /**
   * WRAPPER MAESTRO CON RE-AUTENTICACIÓN
   * Implementa Fase Proactiva, Ejecución y Fase Reactiva (401).
   */
  const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const state = api.getState() as RootState
    const { token, refreshToken, sessionId } = state.auth // Extraemos sessionId para persistencia
    const url = typeof args === 'string' ? args : args.url

    // --- FASE 1: PROACTIVA (Antes de la petición) ---
    if (!isAuthEndpoint(url) && token && refreshToken) {
      const tokenStatus = checkTokenExpiration(token, refreshToken)

      if (tokenStatus.action === 'refresh') {
        if (!refreshPromise) {
            console.log(`[PROACTIVE-REFRESH] ${tokenStatus.reason}`)
            refreshPromise = refreshTokens(refreshToken, baseUrl)
        }

        try {
            const newData = await refreshPromise
            api.dispatch(setCredentials({
                user: newData.user || state.auth.user!,
                access: newData.access,
                refresh: newData.refresh || refreshToken,
                session_id: sessionId! // IMPORTANTE: Mantenemos el ID de sesión activo
            }))
        } catch { 
            handleForceLogout(api)
            return { error: { status: 401, data: 'Session expired' } }
        } finally {
            refreshPromise = null
        }
      }
    }

    // --- FASE 2: EJECUCIÓN NORMAL ---
    let result = await baseQueryWithLogging(args, api, extraOptions)

    // --- FASE 3: REACTIVA (Si el servidor responde 401) ---
    if (result.error?.status === 401 && !isAuthEndpoint(url)) {
        console.log('[REACTIVE-REFRESH] 401 detectado')
        const currentState = api.getState() as RootState
        const currentRefresh = currentState.auth.refreshToken

        if (currentRefresh) {
            if (!refreshPromise) {
                refreshPromise = refreshTokens(currentRefresh, baseUrl)
            }

            try {
                const newData = await refreshPromise
                api.dispatch(setCredentials({
                    user: newData.user || currentState.auth.user!,
                    access: newData.access,
                    refresh: newData.refresh || currentRefresh,
                    session_id: currentState.auth.sessionId! // Persistimos sessionId en el reauth
                }))
                // Re-intentamos la petición original con el nuevo token
                result = await baseQueryWithLogging(args, api, extraOptions)
            } catch {
                handleForceLogout(api)
            } finally {
                refreshPromise = null
            }
        } else {
            handleForceLogout(api)
        }
    }

    return result
  }

  return baseQueryWithReauth
}