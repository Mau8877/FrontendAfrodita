import { api } from '@/app/store/api/api'
import type { 
  VentaCreateResponse, 
  CreateVentaRequest, 
  VentasListResponse,
  PedidoDetailResponse
} from '../types'

export const ventasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- 1. BUSCAR PEDIDO POR CÓDIGO (PRE-VENTA) ---
    // Ideal para buscar con el código "K4SV" y rellenar el formulario
    getPedidoByCodigo: builder.query<PedidoDetailResponse, string>({
      query: (codigo) => ({
        url: '/ventas/pedidos/buscar/',
        method: 'GET',
        params: { codigo },
      }) 
    }),

    // --- 3. LISTADO HISTÓRICO DE VENTAS ---
    getVentas: builder.query<VentasListResponse, { page?: number; search?: string; estado?: string }>({
      query: (params) => ({
        url: '/ventas/ventas/',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Ventas' as const, id })),
              { type: 'Ventas', id: 'LIST' },
            ]
          : [{ type: 'Ventas', id: 'LIST' }],
    }),

    // --- 4. CREAR VENTA (CHECKOUT) ---
    createVenta: builder.mutation<VentaCreateResponse, CreateVentaRequest>({
      query: (nuevaVenta) => ({
        url: '/ventas/ventas/',
        method: 'POST',
        body: nuevaVenta,
      }),
      invalidatesTags: [
        { type: 'Ventas', id: 'LIST' }, // Refresca la tabla de ventas
        { type: 'ActionLogs', id: 'LIST' } // Por si tienes un log de auditoría
      ],
    }),

    // --- 5. ANULAR VENTA ---
    anularVenta: builder.mutation<{ success: boolean; mensaje: string }, string>({
      query: (id) => ({
        url: `/ventas/ventas/${id}/anular/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Ventas', id },
        { type: 'Ventas', id: 'LIST' },
        { type: 'ActionLogs', id: 'LIST' }
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetPedidoByCodigoQuery,
  useLazyGetPedidoByCodigoQuery, // Exportamos la versión Lazy para ejecutarla al hacer click en "Buscar"
  useGetVentasQuery,
  useCreateVentaMutation,
  useAnularVentaMutation,
} = ventasApi