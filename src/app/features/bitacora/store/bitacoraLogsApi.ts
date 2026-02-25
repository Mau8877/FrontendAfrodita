import { api } from '@/app/store/api/api'
import { 
  type ActionLogsListResponse, 
  type ActionLogsFilters 
} from '../types'

export const bitacoraLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE ACCIONES (Solo lectura) ---
    getActionLogs: builder.query<ActionLogsListResponse, ActionLogsFilters>({
      query: (params) => ({
        url: '/action-logs/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'ActionLogs' as const, id })),
              { type: 'ActionLogs', id: 'LIST' },
            ]
          : [{ type: 'ActionLogs', id: 'LIST' }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetActionLogsQuery,
} = bitacoraLogsApi