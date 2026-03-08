import { api } from '@/app/store/api/api'
import type { 
  BranchResponse, 
  BranchListResponse, 
  BranchSimpleResponse,
  CreateBranchRequest, 
  UpdateBranchRequest 
} from '../types'

export const branchesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO PAGINADO ---
    getBranches: builder.query<BranchListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: '/logistic/branch/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Branches' as const, id })),
              { type: 'Branches', id: 'LIST' },
            ]
          : [{ type: 'Branches', id: 'LIST' }],
    }),

    // --- LISTA SIMPLE (PARA SELECTORES) ---
    getBranchesSimple: builder.query<BranchSimpleResponse, void>({
      query: () => '/logistic/branch/simple-list/',
      providesTags: [{ type: 'Branches', id: 'LIST' }],
    }),

    // --- DETALLE ---
    getBranchById: builder.query<BranchResponse, string>({
      query: (id) => `/logistic/branch/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Branches', id }],
    }),

    // --- CREAR ---
    createBranch: builder.mutation<BranchResponse, CreateBranchRequest>({
      query: (newBranch) => ({
        url: '/logistic/branch/',
        method: 'POST',
        body: newBranch,
      }),
      invalidatesTags: [
        { type: 'Branches', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR ---
    updateBranch: builder.mutation<BranchResponse, UpdateBranchRequest>({
      query: ({ id, body }) => ({
        url: `/logistic/branch/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Branches', id },
        { type: 'Branches', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

    // --- ELIMINAR ---
    deleteBranch: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/logistic/branch/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Branches', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetBranchesQuery,
  useGetBranchesSimpleQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchesApi;