import { api } from '@/app/store/api/api'

export const testApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    getProtectedData: builder.query<any, void>({
      query: () => '/auth/test-protected/', // La URL que creamos en Django
      // Importante: No cachear para ver la petición real cada vez
      keepUnusedDataFor: 0, 
    }),
  }),
})

export const { useLazyGetProtectedDataQuery } = testApi