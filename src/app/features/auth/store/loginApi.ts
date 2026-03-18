import { api } from '@/app/store/api/api' 
import { setCredentials } from './authSlice' 
import { type AuthResponse, type LogoutRequest } from '../types'
import { type LoginFormValues } from '../schemas/loginSchema'

export const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    login: builder.mutation<AuthResponse, LoginFormValues>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled // 'data' es el AuthResponse completo
          
          if (data.success) {
            // Accedemos a data.data que es donde están los tokens y el user
            dispatch(setCredentials({
              user: data.data.user,
              access: data.data.access,
              refresh: data.data.refresh,
              session_id: data.data.session_id 
            }))
          }
        } catch {
          // Errores manejados en el componente
        }
      },
      invalidatesTags: ['Auth'], 
    }),

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

export const { useLoginMutation, useLogoutServerMutation } = loginApi