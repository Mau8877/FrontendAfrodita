import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

/**
 * 1. INTERFAZ DE USUARIO
 * Representa la estructura del usuario devuelto por el backend de Django.
 */
export interface User {
  user_id: string  
  username: string
  email: string
  rol: string
}

/**
 * 2. INTERFAZ DEL ESTADO (AuthState)
 * Define la forma de la rama 'auth' en el store de Redux.
 * NOTA: Agregamos sessionId para la trazabilidad de auditoría.
 */
interface AuthState {
  user: User | null
  token: string | null        
  refreshToken: string | null 
  sessionId: string | null
}

/**
 * 3. ESTADO INICIAL
 */
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  sessionId: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Guarda las credenciales tras un login exitoso.
     * El payload debe incluir session_id desde el backend.
     */
    setCredentials: (
      state, 
      action: PayloadAction<{ user: User; access: string; refresh: string; session_id: string }>
    ) => {
      const { user, access, refresh, session_id } = action.payload
      state.user = user
      state.token = access
      state.refreshToken = refresh
      state.sessionId = session_id 
    },

    /**
     * Limpia el estado local.
     * Importante resetear el sessionId para evitar fugas de auditoría.
     */
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.sessionId = null
    },

    /**
     * Actualiza el Access Token. 
     * Usado por el middleware de refresco automático.
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    }
  },
})

export const { setCredentials, logout, updateAccessToken } = authSlice.actions 
export default authSlice.reducer

// --- SELECTORES MEMOIZADOS ---

const selectAuth = (state: RootState) => state.auth;

export const authSelectors = {
  // Estado de autenticación rápido
  isAuthenticated: (state: RootState) => !!state.auth.token,
  
  // Datos del perfil del usuario
  user: (state: RootState) => state.auth.user,
  
  // Tokens de acceso
  token: (state: RootState) => state.auth.token,

  // ID de Sesión para Auditoría 
  sessionId: (state: RootState) => state.auth.sessionId,

  /**
   * Selector Memoizado: authData
   * Evita el error de "referencia inestable" al agrupar datos del estado.
   * Ideal para usarlo en layouts o componentes que necesitan info general.
   */
  authData: createSelector(
    [selectAuth],
    (auth) => ({
      user_id: auth.user?.user_id, 
      role: auth.user?.rol,
      token: auth.token,
      email: auth.user?.email,
      refresh_token: auth.refreshToken,
      sessionId: auth.sessionId
    })
  )
}