import { api } from '@/app/store/api/api'
import { type RegisterFormValues } from '../types' // <--- Importamos el tipo inferido de Zod

// 1. Definimos QUÉ recibimos (Response)
// Esto lo dejamos aquí porque es específico de este endpoint (a menos que uses una respuesta genérica)
export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    email: string
    username: string
    // A veces el backend devuelve el ID también, ajusta según tu necesidad
  } | null
  errors?: Record<string, string[]> 
}

// 2. Inyectamos el endpoint
// Request: Usamos 'RegisterFormValues' para asegurar que coincida con el formulario
export const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    register: builder.mutation<RegisterResponse, RegisterFormValues>({
      query: (userData) => ({
        url: '/auth/register/', 
        method: 'POST',
        body: userData,
      }),
      // No usamos onQueryStarted ni invalidatesTags
      // porque registrarse no cambia el estado de la sesión actual (aún).
    }),

  }),
  overrideExisting: false,
})

// 3. Exportamos el hook
export const { useRegisterMutation } = registerApi