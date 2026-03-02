import { api } from '@/app/store/api/api'
import { 
  type CategoryResponse, 
  type CategoriesListResponse, 
  type CreateCategoryRequest, 
  type UpdateCategoryRequest 
} from '../types'

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE CATEGORÍAS ---
    getCategories: builder.query<CategoriesListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/category/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Categories' as const, id })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    // --- DETALLE DE UNA CATEGORÍA ---
    getCategoryById: builder.query<CategoryResponse, string>({
      query: (id) => `/inventario/category/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),

    // --- CREAR CATEGORÍA ---
    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (newCategory) => ({
        url: '/inventario/category/',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR CATEGORÍA ---
    updateCategory: builder.mutation<CategoryResponse, { id: string; body: UpdateCategoryRequest | { restore: boolean } }>({
      query: ({ id, body }) => ({
        url: `/inventario/category/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ELIMINAR (SOFT O HARD DELETE) ---
    deleteCategory: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/category/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi