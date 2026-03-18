import { api } from '@/app/store/api/api'
import { type AuthResponse } from '../types'
import { type RegisterFormValues } from '../schemas/registerSchema'

export const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterFormValues>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useRegisterMutation } = registerApi