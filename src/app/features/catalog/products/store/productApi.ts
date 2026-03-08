import { api } from '@/app/store/api/api'
import { 
  type ProductResponse, 
  type ProductsListResponse, 
  type ProductSelectorsResponse,
  type ProductSimpleListResponse,
} from '../types'

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTA DE PRODUCTOS SIMPLES PARA REPOSICION DE STOCK ---
    getProductsSimple: builder.query<ProductSimpleListResponse, void>({
      query: () => '/inventario/products/simple-list/',
      providesTags: [
        { type: 'Products', id: 'SIMPLE' },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    // --- SELECTORES (Marcas, Categorías, Tipos, Colores) ---
    getProductSelectors: builder.query<ProductSelectorsResponse, void>({
      query: () => '/inventario/products/selectors/',
      providesTags: [
        { type: 'Products', id: 'SELECTORS' },
        { type: 'Brands', id: 'LIST' },     
        { type: 'Categories', id: 'LIST' }, 
        { type: 'Colors', id: 'LIST' },
        { type: 'ProductTypes', id: 'LIST' },
      ],
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
  useGetProductsSimpleQuery,
  useGetProductSelectorsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi