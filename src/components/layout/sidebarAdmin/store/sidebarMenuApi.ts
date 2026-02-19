import { api } from '@/app/store/api/api'

// Definimos los tipos de lo que devuelve el Backend
export interface MenuItem {
  label: string
  icon: string
  to: string
  variant?: 'highlight'
}

export interface SidebarData {
  menu: MenuItem[]
  permissions: string[]
}

// Inyectamos el endpoint
export const sidebarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSidebarMenu: builder.query<SidebarData, void>({
      query: () => '/menu/sidebar/',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => response.data,
      keepUnusedDataFor: 60, 
      providesTags: ['Menu'],
    }),
  }),
  overrideExisting: false,
})

// Exportamos el hook autogenerado
export const { useGetSidebarMenuQuery } = sidebarApi