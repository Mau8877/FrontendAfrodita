import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

// 1. Definimos cómo se ve la información del usuario
export interface User {
  user_id: string
  email: string
  username: string
  rol: string
}

// 2. Definimos el estado inicial (vacío)
interface AuthState {
  user: User | null
  token: string | null        // Access Token
  refreshToken: string | null // Refresh Token
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
}

// 3. El Slice (La lógica para guardar/borrar)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acción para guardar datos al loguearse
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access: string; refresh: string }>
    ) => {
      const { user, access, refresh } = action.payload
      state.user = user
      state.token = access
      state.refreshToken = refresh
    },
    // Acción para salir (Logout)
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
    },
    // Acción para actualizar solo el token (cuando se hace refresh)
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

// 4. EXPORTACIONES (Esto es lo que faltaba)
export const authActions = authSlice.actions // Exportamos las acciones agrupadas
export const { setCredentials, logout, updateAccessToken } = authSlice.actions // Y también sueltas por si acaso

export default authSlice.reducer

// 5. SELECTORES (Para leer los datos desde otros archivos)
export const authSelectors = {
  // Devuelve si está autenticado
  isAuthenticated: (state: RootState) => !!state.auth.token,
  
  // Devuelve el token actual
  token: (state: RootState) => state.auth.token,
  
  // Devuelve un objeto con todo (para tu RouterProvider)
  authData: (state: RootState) => ({
    user_id: state.auth.user?.user_id,
    role: state.auth.user?.rol,
    token: state.auth.token,
    email: state.auth.user?.email,
    user: state.auth.user,
    refresh_token: state.auth.refreshToken // Para la API
  }),
}