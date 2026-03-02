import { api } from '@/app/store/api/api'
import { 
  type ColorResponse, 
  type ColorsListResponse, 
  type CreateColorRequest, 
  type UpdateColorRequest,
  type FamiliaListResponse,
  type FamiliaResponse,
  type CreateFamiliaRequest,
  type UpdateFamiliaRequest
} from '../types'

export const colorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // --- ENDPOINTS DE COLORES ---
    // ==========================================
    getColors: builder.query<ColorsListResponse, { page?: number; search?: string; ordering?: string; id_familia?: string }>({
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

    // ==========================================
    // --- ENDPOINTS DE FAMILIAS DE COLORES ---
    // ==========================================
    getColorFamilies: builder.query<FamiliaListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/colors/families/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'ColorFamilies' as const, id })),
              { type: 'ColorFamilies', id: 'LIST' },
            ]
          : [{ type: 'ColorFamilies', id: 'LIST' }],
    }),

    createColorFamily: builder.mutation<FamiliaResponse, CreateFamiliaRequest>({
      query: (newFamily) => ({
        url: '/inventario/colors/families/',
        method: 'POST',
        body: newFamily,
      }),
      invalidatesTags: [
        { type: 'ColorFamilies', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    updateColorFamily: builder.mutation<FamiliaResponse, { id: string; body: UpdateFamiliaRequest }>({
      query: ({ id, body }) => ({
        url: `/inventario/colors/families/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ColorFamilies', id },
        { type: 'ColorFamilies', id: 'LIST' },
        { type: 'Colors', id: 'LIST' }, // Recargamos colores por si cambió el nombre de la familia
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    deleteColorFamily: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/colors/families/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'ColorFamilies', id: 'LIST' },
        { type: 'Colors', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    // --- SELECTORES (PARA EL DROPDOWN DEL MODAL) ---
    getColorSelectors: builder.query<{ data: { familias: { id: string, nombre: string }[] } }, void>({
      query: () => '/inventario/colors/families/', // O el endpoint de selectores que prefieras
      transformResponse: (response: FamiliaListResponse) => ({
        data: {
          familias: response.data.results.map(f => ({ id: f.id, nombre: f.nombre }))
        }
      })
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
  useGetColorFamiliesQuery,
  useCreateColorFamilyMutation,
  useUpdateColorFamilyMutation,
  useDeleteColorFamilyMutation,
  useGetColorSelectorsQuery,
} = colorsApi