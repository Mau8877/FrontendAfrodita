import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

// 1. Definimos cómo se ve la información del usuario
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
    // 2. Acción para guardar datos al loguearse
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access: string; refresh: string }>
    ) => {
      const { user, access, refresh } = action.payload
      state.user = user
      state.token = access
      state.refreshToken = refresh
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    }
  },
})

// Exportamos las acciones
export const authActions = authSlice.actions 
export const { setCredentials, logout, updateAccessToken } = authSlice.actions 

export default authSlice.reducer

// 3. Selectores para acceder a los datos desde cualquier parte de la app
export const authSelectors = {
  isAuthenticated: (state: RootState) => !!state.auth.token,
  user: (state: RootState) => state.auth.user,
  token: (state: RootState) => state.auth.token,
  
  // Helper que usa el RouterProvider y createBaseApi
  authData: (state: RootState) => ({
    user_id: state.auth.user?.user_id, 
    role: state.auth.user?.rol,
    token: state.auth.token,
    email: state.auth.user?.email,
    refresh_token: state.auth.refreshToken
  })
}