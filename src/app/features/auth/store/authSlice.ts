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
  sessionId: string | null
}

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
    setCredentials: (
      state,
      action: PayloadAction<{ 
        user: User; 
        access: string; 
        refresh: string; 
        session_id: string 
      }>
    ) => {
      const { user, access, refresh, session_id } = action.payload
      state.user = user
      state.token = access
      state.refreshToken = refresh
      state.sessionId = session_id 
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.sessionId = null
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