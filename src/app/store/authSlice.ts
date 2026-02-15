import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

// 1. Interfaz de usuario basada en tu modelo de datos
export interface User {
  user_id: string  
  username: string
  email: string
  rol: string
}

interface AuthState {
  user: User | null
  token: string | null        
  refreshToken: string | null 
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Maneja el login guardando usuario y tokens
    setCredentials: (
      state, 
      action: PayloadAction<{ user: User; access: string; refresh: string }>
    ) => {
      const { user, access, refresh } = action.payload
      state.user = user
      state.token = access
      state.refreshToken = refresh
    },
    // Limpia el estado al cerrar sesión
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
    },
    // Útil para el refresco automático de tokens (Silent Refresh)
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    }
  },
})

// Exportación de acciones para usar con dispatch
export const { setCredentials, logout, updateAccessToken } = authSlice.actions 

// Exportación del reducer para el store
export default authSlice.reducer

// --- SELECTORES MEMOIZADOS (Evitan re-renders innecesarios) ---

// Selector base para acceder a la rama de auth
const selectAuth = (state: RootState) => state.auth;

export const authSelectors = {
  // Comprueba si hay un token activo
  isAuthenticated: (state: RootState) => !!state.auth.token,
  
  // Obtiene el objeto usuario completo
  user: (state: RootState) => state.auth.user,
  
  // Obtiene el token de acceso
  token: (state: RootState) => state.auth.token,

  /**
   * Selector Memoizado: authData
   * Este selector combina múltiples datos en un solo objeto.
   * Gracias a createSelector, solo se vuelve a calcular si state.auth cambia,
   * eliminando el error de "Selectors that return a new reference".
   */
  authData: createSelector(
    [selectAuth],
    (auth) => ({
      user_id: auth.user?.user_id, 
      role: auth.user?.rol,
      token: auth.token,
      email: auth.user?.email,
      refresh_token: auth.refreshToken
    })
  )
}