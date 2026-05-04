import { api } from "@/app/store/api/api";
import type {
  CompraProveedorReporteItem,
  ProductoMasVendidoReporteItem,
  StockCriticoReporteItem,
  VentaPeriodoReporteResponse,
  VentaSucursalReporteItem,
  VentaPeriodoAgrupado,
} from "../types";

export interface RangoFechasParams {
  desde: string;
  hasta: string;
}

export interface ProductosMasVendidosParams extends RangoFechasParams {
  limite?: number;
}

export interface VentasPeriodoParams extends RangoFechasParams {
  agrupado_por: VentaPeriodoAgrupado;
}

export const reportesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getComprasProveedor: builder.query<CompraProveedorReporteItem[], RangoFechasParams>({
      query: (params) => ({ url: "/reportes/compras-proveedor/", method: "GET", params }),
      providesTags: [{ type: "Ventas", id: "REPORTES_COMPRAS_PROVEEDOR" }],
    }),
    getProductosMasVendidos: builder.query<ProductoMasVendidoReporteItem[], ProductosMasVendidosParams>({
      query: (params) => ({ url: "/reportes/productos-mas-vendidos/", method: "GET", params }),
      providesTags: [{ type: "Ventas", id: "REPORTES_PRODUCTOS_MAS_VENDIDOS" }],
    }),
    getStockCritico: builder.query<StockCriticoReporteItem[], void>({
      query: () => ({ url: "/reportes/stock-critico/", method: "GET" }),
      providesTags: [{ type: "Stock", id: "REPORTES_STOCK_CRITICO" }],
    }),
    getVentasPeriodo: builder.query<VentaPeriodoReporteResponse, VentasPeriodoParams>({
      query: (params) => ({ url: "/reportes/ventas-periodo/", method: "GET", params }),
      providesTags: [{ type: "Ventas", id: "REPORTES_VENTAS_PERIODO" }],
    }),
    getVentasSucursal: builder.query<VentaSucursalReporteItem[], RangoFechasParams>({
      query: (params) => ({ url: "/reportes/ventas-sucursal/", method: "GET", params }),
      providesTags: [{ type: "Ventas", id: "REPORTES_VENTAS_SUCURSAL" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetComprasProveedorQuery,
  useLazyGetProductosMasVendidosQuery,
  useLazyGetStockCriticoQuery,
  useLazyGetVentasPeriodoQuery,
  useLazyGetVentasSucursalQuery,
} = reportesApi;
