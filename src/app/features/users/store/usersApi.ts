import { api } from '@/app/store/api/api'
import { 
  type UserResponse, 
  type UsersListResponse, 
  type CreateUserRequest, 
  type UpdateUserRequest 
} from '../types'

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE USUARIOS ---
    getUsers: builder.query<UsersListResponse, { page?: number; search?: string; id_rol?: string; ordering?: string }>({
      query: (params) => ({
        url: '/users/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // --- DETALLE DE UN USUARIO ---
    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    // --- CREAR USUARIO ---
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (newUser) => ({
        url: '/users/',
        method: 'POST',
        body: newUser,
      }),
      // Invalidamos la lista de usuarios y la bitácora de acciones
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'    
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR USUARIO ---
    updateUser: builder.mutation<UserResponse, { id: string; body: UpdateUserRequest | { restore: boolean } }>({
      query: ({ id, body }) => ({
        url: `/users/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'    
      ],
    }),

    // --- ELIMINAR (SOFT O HARD DELETE) ---
    deleteUser: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/users/${id}/`,
        method: 'DELETE',
        params: { permanent },
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' },
        'LoginLogs'    
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi