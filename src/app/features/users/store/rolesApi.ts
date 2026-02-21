import { api } from '@/app/store/api/api'
import { type Role, type RolesListResponse } from '../types'

export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE ROLES ---
    getRoles: builder.query<RolesListResponse, void>({
      query: () => ({
        url: '/roles/',
        method: 'GET',
      }),
      providesTags: (result) => {
        const data = result?.data;
        
        const rolesArray: Role[] = Array.isArray(data) 
          ? data 
          : (data?.results ?? []);

        return [
          { type: 'Roles' as const, id: 'LIST' },
          ...rolesArray.map(({ id }) => ({ type: 'Roles' as const, id }))
        ];
      },
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetRolesQuery,
} = rolesApi