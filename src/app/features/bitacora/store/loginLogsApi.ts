import { api } from '@/app/store/api/api'
import { 
  type LoginLogsListResponse, 
  type LoginLogResponse,
  type LoginLogsFilters
} from '../types'

export const loginLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE LOGS (Solo lectura) ---
    getLoginLogs: builder.query<LoginLogsListResponse, LoginLogsFilters>({
      query: (params) => ({
        url: '/login-logs/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'LoginLogs' as const, id })),
              { type: 'LoginLogs', id: 'LIST' },
            ]
          : [{ type: 'LoginLogs', id: 'LIST' }],
    }),

    // --- DETALLE DE UN LOG ESPECÍFICO ---
    getLoginLogById: builder.query<LoginLogResponse, string>({
      query: (id) => `/login-logs/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'LoginLogs', id }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetLoginLogsQuery,
  useGetLoginLogByIdQuery,
} = loginLogsApi