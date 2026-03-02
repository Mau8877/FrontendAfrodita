import { api } from '@/app/store/api/api'
import { 
  type ProductTypeResponse, 
  type ProductTypeListResponse, 
  type CreateProductTypeRequest, 
  type UpdateProductTypeRequest 
} from '../types'

export const productTypeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE TIPOS DE PRODUCTO ---
    getProductTypes: builder.query<ProductTypeListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/product-types/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'ProductTypes' as const, id })),
              { type: 'ProductTypes', id: 'LIST' },
            ]
          : [{ type: 'ProductTypes', id: 'LIST' }],
    }),

    // --- DETALLE DE UN TIPO ---
    getProductTypeById: builder.query<ProductTypeResponse, string>({
      query: (id) => `/inventario/product-types/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'ProductTypes', id }],
    }),

    // --- CREAR TIPO ---
    createProductType: builder.mutation<ProductTypeResponse, CreateProductTypeRequest>({
      query: (newType) => ({
        url: '/inventario/product-types/',
        method: 'POST',
        body: newType,
      }),
      invalidatesTags: [
        { type: 'ProductTypes', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR TIPO ---
    updateProductType: builder.mutation<ProductTypeResponse, { id: string; body: UpdateProductTypeRequest | { restore: boolean } }>({
      query: ({ id, body }) => ({
        url: `/inventario/product-types/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ProductTypes', id },
        { type: 'ProductTypes', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ELIMINAR (SOFT O HARD DELETE) ---
    deleteProductType: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/product-types/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'ProductTypes', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetProductTypesQuery,
  useGetProductTypeByIdQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} = productTypeApi