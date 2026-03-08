import { api } from '@/app/store/api/api'
import { 
  type ReplenishmentResponse, 
  type ReplenishmentListResponse, 
  type CreateReplenishmentRequest 
} from '../types'

export const replenishmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE REPOSICIONES (COMPRAS) ---
    getReplenishments: builder.query<ReplenishmentListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/replenishment/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Replenishment' as const, id })),
              { type: 'Replenishment', id: 'LIST' },
            ]
          : [{ type: 'Replenishment', id: 'LIST' }],
    }),

    // --- DETALLE DE UNA REPOSICIÓN (INCLUYE LOTES Y DETALLES) ---
    getReplenishmentById: builder.query<ReplenishmentResponse, string>({
      query: (id) => `/inventario/replenishment/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Replenishment', id }],
    }),

    // --- CREAR REPOSICIÓN  ---
    createReplenishment: builder.mutation<ReplenishmentResponse, CreateReplenishmentRequest>({
      query: (newReplenishment) => ({
        url: '/inventario/replenishment/',
        method: 'POST',
        body: newReplenishment,
      }),
      invalidatesTags: [
        { type: 'Replenishment', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs',
        'Stock'  
      ],
    }),

    // --- ANULACIÓN DE REPOSICIÓN (REVERSA DE STOCK) ---
    annulReplenishment: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/inventario/replenishment/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Replenishment', id },
        { type: 'Replenishment', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs',
        'Stock'
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetReplenishmentsQuery,
  useGetReplenishmentByIdQuery,
  useCreateReplenishmentMutation,
  useAnnulReplenishmentMutation,
} = replenishmentApi