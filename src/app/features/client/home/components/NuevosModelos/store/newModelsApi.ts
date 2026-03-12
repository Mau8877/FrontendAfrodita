import { api } from '@/app/store/api/api'
import { type NewModelsResponse } from '@/app/features/catalog'

export const newModelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    /**
     * GET_NEW_MODELS (Público)
     * Recupera los 3 productos más recientes marcados como visibles.
     * No requiere token de autenticación según la View de Django.
     */
    getNewModels: builder.query<NewModelsResponse , void>({
      query: () => '/inventario/new-models/',
      providesTags: [{ type: 'Products', id: 'NEW_MODELS' }],
      // Mantenemos la data en cache por 5 minutos para optimizar la Landing
      keepUnusedDataFor: 300, 
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetNewModelsQuery,
} = newModelsApi