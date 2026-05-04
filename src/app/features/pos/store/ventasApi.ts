import { api } from "@/app/store/api/api";
import type {
  VentaCreateResponse,
  CreateVentaRequest,
  VentasListResponse,
  PedidoDetailResponse,
  ProductoSimpleListResponse,
} from "../types";

export const ventasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // --- 1. BUSCAR PEDIDO POR CÓDIGO (PRE-VENTA) ---
    getPedidoByCodigo: builder.query<PedidoDetailResponse, string>({
      query: (codigo) => ({
        url: "/sales/pedidos/buscar/",
        method: "GET",
        params: { codigo },
      }),
    }),

    // --- 2. LISTADO HISTÓRICO DE VENTAS ---
    getVentas: builder.query<
      VentasListResponse,
      { page?: number; search?: string; estado?: string }
    >({
      query: (params) => ({
        url: "/ventas/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({
                type: "Ventas" as const,
                id,
              })),
              { type: "Ventas", id: "LIST" },
            ]
          : [{ type: "Ventas", id: "LIST" }],
    }),

    // --- 3. CREAR VENTA (CHECKOUT) ---
    createVenta: builder.mutation<VentaCreateResponse, CreateVentaRequest>({
      query: (nuevaVenta) => ({
        url: "/sales/ventas/",
        method: "POST",
        body: nuevaVenta,
      }),
      invalidatesTags: [
        { type: "Ventas", id: "LIST" }, // Refresca la tabla de ventas
        { type: "PEDIDO", id: "LIST" }, // Refresca la tabla de pedidos
        { type: "ActionLogs", id: "LIST" }, // Por si tienes un log de auditoría
      ],
    }),

    // --- 4. ANULAR VENTA ---
    anularVenta: builder.mutation<
      { success: boolean; mensaje: string },
      string
    >({
      query: (id) => ({
        url: `/ventas/${id}/anular/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Ventas", id },
        { type: "Ventas", id: "LIST" },
        { type: "ActionLogs", id: "LIST" },
      ],
    }),

    // --- 5. BUSCADOR SIMPLE DE PRODUCTOS ---
    getProductsSimple: builder.query<
      ProductoSimpleListResponse,
      { search?: string }
    >({
      query: (params) => ({
        url: "/products/simple-list/",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Products", id: "SIMPLE_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPedidoByCodigoQuery,
  useLazyGetPedidoByCodigoQuery,
  useGetVentasQuery,
  useCreateVentaMutation,
  useAnularVentaMutation,
  useGetProductsSimpleQuery,
  useLazyGetProductsSimpleQuery,
} = ventasApi;
