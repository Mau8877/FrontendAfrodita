import { api } from '@/app/store/api/api'
import type { 
  ShippingRateResponse, 
  ShippingRateListResponse, 
  CreateShippingRateRequest, 
  UpdateShippingRateRequest 
} from '../types'

export const shippingRatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO PAGINADO ---
    getShippingRates: builder.query<ShippingRateListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/logistic/shipping-rate/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'ShippingRates' as const, id })),
              { type: 'ShippingRates', id: 'LIST' },
            ]
          : [{ type: 'ShippingRates', id: 'LIST' }],
    }),

    // --- DETALLE ---
    getShippingRateById: builder.query<ShippingRateResponse, string>({
      query: (id) => `/logistic/shipping-rate/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'ShippingRates', id }],
    }),

    // --- CREAR ---
    createShippingRate: builder.mutation<ShippingRateResponse, CreateShippingRateRequest>({
      query: (newRate) => ({
        url: '/logistic/shipping-rate/',
        method: 'POST',
        body: newRate,
      }),
      invalidatesTags: [
        { type: 'ShippingRates', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR ---
    updateShippingRate: builder.mutation<ShippingRateResponse, UpdateShippingRateRequest>({
      query: ({ id, body }) => ({
        url: `/logistic/shipping-rate/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ShippingRates', id },
        { type: 'ShippingRates', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    // --- ELIMINAR ---
    deleteShippingRate: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/logistic/shipping-rate/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'ShippingRates', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetShippingRatesQuery,
  useGetShippingRateByIdQuery,
  useCreateShippingRateMutation,
  useUpdateShippingRateMutation,
  useDeleteShippingRateMutation,
} = shippingRatesApi;