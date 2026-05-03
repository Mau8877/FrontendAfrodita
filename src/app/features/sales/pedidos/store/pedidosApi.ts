import { api } from "@/app/store/api/api";
import type {
  CreatePedidoRequest,
  PedidoResponse,
  PedidosListResponse,
  UpdatePedidoRequest,
} from "../types";

export const pedidosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPedidos: builder.query<PedidosListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: "/sales/pedidos/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: "PEDIDO" as const, id })),
              { type: "PEDIDO", id: "LIST" },
            ]
          : [{ type: "PEDIDO", id: "LIST" }],
    }),

    getPedidoById: builder.query<PedidoResponse, string>({
      query: (id) => `/sales/pedidos/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "PEDIDO", id }],
    }),

    createPedidoGestion: builder.mutation<{
      success: boolean;
      codigo: string;
      total: number;
      data: unknown;
    }, CreatePedidoRequest>({
      query: (body) => ({
        url: "/sales/pedidos/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PEDIDO", id: "LIST" }],
    }),

    updatePedido: builder.mutation<PedidoResponse, UpdatePedidoRequest>({
      query: ({ id, body }) => ({
        url: `/sales/pedidos/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PEDIDO", id },
        { type: "PEDIDO", id: "LIST" },
        { type: "ActionLogs", id: "LIST" },
        "LoginLogs",
      ],
    }),

    deletePedido: builder.mutation<{ success: boolean; message: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/sales/pedidos/${id}/`,
        method: "DELETE",
        params: { permanent },
      }),
      invalidatesTags: [
        { type: "PEDIDO", id: "LIST" },
        { type: "ActionLogs", id: "LIST" },
        "LoginLogs",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPedidosQuery,
  useGetPedidoByIdQuery,
  useCreatePedidoGestionMutation,
  useUpdatePedidoMutation,
  useDeletePedidoMutation,
} = pedidosApi;
