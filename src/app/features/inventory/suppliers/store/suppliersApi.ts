/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/app/store/api/api'
import { 
  type SupplierResponse, 
  type SuppliersListResponse, 
  type CreateSupplierRequest, 
  type UpdateSupplierRequest 
} from '../types'

export const suppliersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE PROVEEDORES ---
    getSuppliers: builder.query<SuppliersListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/inventario/suppliers/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Suppliers' as const, id })),
              { type: 'Suppliers', id: 'LIST' },
            ]
          : [{ type: 'Suppliers', id: 'LIST' }],
    }),

    getSuppliersSimple: builder.query<any, void>({
      query: () => '/inventario/suppliers/simple-list/',
      providesTags: [{ type: 'Suppliers', id: 'LIST' }],
    }),

    // --- DETALLE DE UN PROVEEDOR ---
    getSupplierById: builder.query<SupplierResponse, string>({
      query: (id) => `/inventario/suppliers/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Suppliers', id }],
    }),

    // --- CREAR PROVEEDOR ---
    createSupplier: builder.mutation<SupplierResponse, CreateSupplierRequest>({
      query: (newSupplier) => ({
        url: '/inventario/suppliers/',
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: [
        { type: 'Suppliers', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR PROVEEDOR ---
    updateSupplier: builder.mutation<SupplierResponse, { id: string; body: UpdateSupplierRequest | { restore: boolean } }>({
      query: ({ id, body }) => ({
        url: `/inventario/suppliers/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Suppliers', id },
        { type: 'Suppliers', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

    // --- ELIMINAR (SOFT O HARD DELETE) ---
    deleteSupplier: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/inventario/suppliers/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Suppliers', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'  
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetSuppliersQuery,
  useGetSuppliersSimpleQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi