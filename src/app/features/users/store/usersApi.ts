import { api } from '@/app/store/api/api'
import { 
  type UserResponse, 
  type UsersListResponse, 
  type CreateUserRequest, 
  type UpdateUserRequest 
} from '../types'

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE USUARIOS (Paginado, con Filtros y Búsqueda) ---
    getUsers: builder.query<UsersListResponse, { page?: number; search?: string; id_rol?: string; ordering?: string }>({
      query: (params) => ({
        url: '/users/',
        method: 'GET',
        params, // RTK Query convierte esto automáticamente a ?page=1&search=...
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
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // --- ACTUALIZAR / RESTAURAR USUARIO ---
    // El backend usa PUT para ambos, diferenciando por 'restore: true' en el body
    updateUser: builder.mutation<UserResponse, { id: string; body: UpdateUserRequest | { restore: boolean } }>({
      query: ({ id, body }) => ({
        url: `/users/${id}/`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // --- ELIMINAR (SOFT O HARD DELETE) ---
    deleteUser: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/users/${id}/`,
        method: 'DELETE',
        params: { permanent }, // Envía ?permanent=true si es borrado físico
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
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