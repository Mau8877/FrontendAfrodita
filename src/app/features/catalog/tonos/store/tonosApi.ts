import { api } from '@/app/store/api/api'
import { 
  type TonoResponse, 
  type TonosListResponse, 
  type CreateTonoRequest, 
  type UpdateTonoRequest 
} from '../types'

export const tonosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // --- ENDPOINTS DE TONOS ---
    // ==========================================
    getTonos: builder.query<TonosListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/tonos/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Tonos' as const, id })),
              { type: 'Tonos', id: 'LIST' },
            ]
          : [{ type: 'Tonos', id: 'LIST' }],
    }),

    getTonoById: builder.query<TonoResponse, string>({
      query: (id) => `/inventario/tonos/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Tonos', id }],
    }),

    createTono: builder.mutation<TonoResponse, CreateTonoRequest>({
      query: (newTono) => ({
        url: '/inventario/tonos/',
        method: 'POST',
        body: newTono,
      }),
      invalidatesTags: [
        { type: 'Tonos', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' }, // Para que tu bitácora se actualice
        'LoginLogs'
      ],
    }),

    updateTono: builder.mutation<TonoResponse, { id: string; body: UpdateTonoRequest['body'] }>({
      query: ({ id, body }) => ({
        url: `/inventario/tonos/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tonos', id },
        { type: 'Tonos', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    deleteTono: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/tonos/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Tonos', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetTonosQuery,
  useGetTonoByIdQuery,
  useCreateTonoMutation,
  useUpdateTonoMutation,
  useDeleteTonoMutation,
} = tonosApi