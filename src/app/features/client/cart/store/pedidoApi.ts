import { api } from '@/app/store/api/api'
import type { 
  CreatePedidoRequest, 
  PedidoCreateSuccess,
  PedidoResponse 
} from '../types'

export const pedidoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Mutación para "congelar" el pedido y obtener el código de 6 dígitos
    createPedido: builder.mutation<PedidoCreateSuccess, CreatePedidoRequest>({
      query: (body) => ({
        url: '/sales/pedidos/', 
        method: 'POST',
        body,
      }),
    }),

    // Por si el admin necesita buscarlo después en el frontend
    getPedidoByCodigo: builder.query<PedidoResponse, string>({
      query: (codigo) => `/sales/pedidos/buscar/?codigo=${codigo}`,
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreatePedidoMutation,
  useGetPedidoByCodigoQuery,
} = pedidoApi