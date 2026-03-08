import { api } from '@/app/store/api/api'
import { 
  type StockListResponse, 
  type StockDetailResponse 
} from '../types'

export const stockApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE EXISTENCIAS (STOCK) ---
    getStock: builder.query<StockListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/stock/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Stock' as const, id })),
              { type: 'Stock', id: 'LIST' },
            ]
          : [{ type: 'Stock', id: 'LIST' }],
    }),

    // --- DETALLE DE LOTES POR PRODUCTO ---
    getStockById: builder.query<StockDetailResponse, string>({
      query: (id) => `/inventario/stock/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Stock', id }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetStockQuery,
  useGetStockByIdQuery,
} = stockApi