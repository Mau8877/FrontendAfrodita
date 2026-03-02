import { api } from '@/app/store/api/api'
import { 
  type ProductResponse, 
  type ProductsListResponse, 
  type ProductSelectorsResponse
} from '../types'

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- SELECTORES (Marcas, Categorías, Tipos, Colores) ---
    getProductSelectors: builder.query<ProductSelectorsResponse, void>({
      query: () => '/inventario/products/selectors/',
    }),

    // --- LISTADO CON FILTROS ---
    getProducts: builder.query<ProductsListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/products/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    // --- DETALLE INDIVIDUAL ---
    getProductById: builder.query<ProductResponse, string>({
      query: (id) => `/inventario/products/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),

    // --- CREAR PRODUCTO (Soporta FormData para imágenes) ---
    createProduct: builder.mutation<ProductResponse, FormData>({
      query: (newProductData) => ({
        url: '/inventario/products/',
        method: 'POST',
        body: newProductData,
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ACTUALIZAR PRODUCTO (Soporta FormData) ---
    updateProduct: builder.mutation<ProductResponse, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/inventario/products/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Products', id },
        { type: 'Products', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ELIMINAR ---
    deleteProduct: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/products/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetProductSelectorsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi