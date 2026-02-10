import { api } from '@/app/store/api/api' 
import { setCredentials } from './authSlice' 
import { type AuthResponse, type LoginFormValues } from '../types' // <--- Usamos tus tipos centralizados

// Inyectamos el endpoint al API central
export const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Usamos <AuthResponse, LoginFormValues> en lugar de definir interfaces aquí
    login: builder.mutation<AuthResponse, LoginFormValues>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      
      // 2. Lógica de "Efecto Secundario" (Side Effect)
      // Actualiza el Redux Store automáticamente cuando el login es exitoso
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          
          if (data.success) {
            // Guardamos tokens y usuario en el slice global
            dispatch(setCredentials({
              user: data.data.user,
              access: data.data.access,
              refresh: data.data.refresh
            }))
          }
        } catch {
          // Si falla, el componente (LoginScreen) manejará el error visualmente
        }
      },
      // Invalidamos 'Auth' para asegurar que cualquier caché anterior se limpie
      invalidatesTags: ['Auth'], 
    }),

  }),
  overrideExisting: false, // Evita conflictos con Hot Reload
})

// Exportamos el hook
export const { useLoginMutation } = loginApi