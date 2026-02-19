import { api } from '@/app/store/api/api' 
import { setCredentials } from './authSlice' 
import { type AuthResponse, type LoginFormValues, type LogoutRequest } from '../types'

export const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- MUTATION DE LOGIN ---
    login: builder.mutation<AuthResponse, LoginFormValues>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            // Guardamos todo en Redux, incluyendo el session_id
            dispatch(setCredentials({
              user: data.data.user,
              access: data.data.access,
              refresh: data.data.refresh,
              session_id: data.data.session_id 
            }))
          }
        } catch {
          // El error se maneja en el componente
        }
      },
      invalidatesTags: ['Auth'], 
    }),

    // --- MUTATION DE LOGOUT ---
    logoutServer: builder.mutation<{ success: boolean; message: string }, LogoutRequest>({
      query: (body) => ({
        url: '/auth/logout/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) => (result?.success ? ['Auth', 'Menu'] : []),
    }),

  }),
  overrideExisting: false,
})

// Exportamos AMBOS hooks
export const { useLoginMutation, useLogoutServerMutation } = loginApi