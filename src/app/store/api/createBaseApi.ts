import { logout, setCredentials, type User } from '@/app/features/auth/store/authSlice'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import moment from 'moment'
import { jwtDecode } from "jwt-decode"
import type { RootState } from '@/app/store'

// Definimos la estructura del Token
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

// --- FUNCIÓN AUXILIAR PARA REFRESCAR SIN DEPENDER DE LA API ---
async function refreshTokens(refreshToken: string, baseUrl: string): Promise<{ access: string; refresh: string; user?: User }> {
  // Aseguramos que la URL no tenga doble slash si baseUrl ya trae uno
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  const response = await fetch(`${cleanBaseUrl}/auth/refresh/`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Refresh failed')
  }

  const json = await response.json()
  
  // Adaptador: Si devuelve { success: true, data: {...} } o directo {...}
  const data = json.data || json 

  return {
      access: data.access,
      refresh: data.refresh,
      user: data.user 
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
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }
      return headers
    },
  })

  const isAuthEndpoint = (url: string): boolean => {
    return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')
  }

  // Lógica PROACTIVA
  const checkTokenExpiration = (token: string | null, refreshToken: string | null) => {
    if (!token || !refreshToken) return { action: 'none' as const }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const exp = decoded.exp 
      const now = moment().unix()
      const timeToAccessExpiry = exp - now
      const minutesUntilExpiry = timeToAccessExpiry / 60

      if (minutesUntilExpiry <= 0) {
         return { action: 'refresh' as const, reason: 'Token expirado' }
      }

      if (minutesUntilExpiry <= minutesToRefresh) {
        return {
          action: 'refresh' as const,
          reason: `Access token expira en ${Math.ceil(minutesUntilExpiry)} minutos`,
        }
      }
    } catch { 
      return { action: 'logout' as const, reason: 'Token inválido' }
    }

    return { action: 'none' as const }
  }

  // Wrapper con Logs
  const baseQueryWithLogging: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions)
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

  // El Wrapper Maestro (Reauth)
  const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const state = api.getState() as RootState
    const { token, refreshToken } = state.auth
    
    const url = typeof args === 'string' ? args : args.url

    // --- FASE 1: PROACTIVA ---
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
                refresh: newData.refresh || refreshToken
            }))
            
        } catch { 
            api.dispatch(logout())
            return { error: { status: 401, data: 'Session expired' } }
        } finally {
            refreshPromise = null
        }
      }
    }

    // --- FASE 2: EJECUCIÓN NORMAL ---
    let result = await baseQueryWithLogging(args, api, extraOptions)

    // --- FASE 3: REACTIVA ---
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
                    refresh: newData.refresh || currentRefresh
                }))

                result = await baseQueryWithLogging(args, api, extraOptions)
            } catch {
                api.dispatch(logout())
            } finally {
                refreshPromise = null
            }
        } else {
            api.dispatch(logout())
        }
    }

    return result
  }

  return baseQueryWithReauth
}