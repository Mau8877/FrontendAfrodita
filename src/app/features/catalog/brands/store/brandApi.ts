import { api } from '@/app/store/api/api'
import { 
  type BrandResponse, 
  type BrandsListResponse, 
  type CreateBrandRequest, 
  type UpdateBrandRequest 
} from '../types'

export const brandsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE MARCAS ---
    getBrands: builder.query<BrandsListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/brands/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Brands' as const, id })),
              { type: 'Brands', id: 'LIST' },
            ]
          : [{ type: 'Brands', id: 'LIST' }],
    }),

    // --- DETALLE DE UNA MARCA ---
    getBrandById: builder.query<BrandResponse, string>({
      query: (id) => `/inventario/brands/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Brands', id }],
    }),

    // --- CREAR MARCA ---
    createBrand: builder.mutation<BrandResponse, FormData | CreateBrandRequest>({
      query: (newBrand) => ({
        url: '/inventario/brands/',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: [
        { type: 'Brands', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR MARCA ---
    updateBrand: builder.mutation<BrandResponse, { id: string; body: FormData | UpdateBrandRequest | { restore: boolean } }>({
      query: ({ id, body }) => ({
        url: `/inventario/brands/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Brands', id },
        { type: 'Brands', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ELIMINAR (SOFT O HARD DELETE) ---
    deleteBrand: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/brands/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Brands', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi