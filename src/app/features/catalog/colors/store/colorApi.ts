import { api } from '@/app/store/api/api'
import { 
  type ColorResponse, 
  type ColorsListResponse, 
  type CreateColorRequest, 
  type UpdateColorRequest
} from '../types'

export const colorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // --- ENDPOINTS DE COLORES ---
    // ==========================================
    getColors: builder.query<ColorsListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/colors/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Colors' as const, id })),
              { type: 'Colors', id: 'LIST' },
            ]
          : [{ type: 'Colors', id: 'LIST' }],
    }),

    getColorById: builder.query<ColorResponse, string>({
      query: (id) => `/inventario/colors/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Colors', id }],
    }),

    createColor: builder.mutation<ColorResponse, CreateColorRequest>({
      query: (newColor) => ({
        url: '/inventario/colors/',
        method: 'POST',
        body: newColor,
      }),
      invalidatesTags: [
        { type: 'Colors', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    updateColor: builder.mutation<ColorResponse, { id: string; body: UpdateColorRequest }>({
      query: ({ id, body }) => ({
        url: `/inventario/colors/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Colors', id },
        { type: 'Colors', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    deleteColor: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/colors/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Colors', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetColorsQuery,
  useGetColorByIdQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorsApi