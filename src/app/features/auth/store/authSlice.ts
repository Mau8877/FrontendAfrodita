import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

export interface User {
  user_id: string
  email: string
  username: string
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
    },
  },
})

export const { setCredentials, logout, updateAccessToken } = authSlice.actions 
export default authSlice.reducer

export const authSelectors = {
  isAuthenticated: (state: RootState) => !!state.auth.token,
  token: (state: RootState) => state.auth.token,
  user: (state: RootState) => state.auth.user,
  refreshToken: (state: RootState) => state.auth.refreshToken,
}