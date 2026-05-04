import type { PaginatedData, StandardResponse } from "@/app/common.types";
import type { VentaEditFormValues } from "./schemas";

export interface Venta {
  id: string;
  estado: "PENDIENTE" | "COMPLETADO" | "CANCELADO";
  total_productos: number;
  total_envio: number;
  total_general: number;
  created_at: string;
  vendedor_nombre: string;
  metodo_pago_nombre: string;
  observaciones: string | null;
}

export interface VentaDetalleItem {
  id: string;
  producto_nombre: string;
  lote_codigo: string;
  cantidad: number;
  precio_final: number;
}

export interface VentaDetail {
  id: string;
  estado: "PENDIENTE" | "COMPLETADO" | "CANCELADO";
  total_productos: number;
  total_envio: number;
  total_general: number;
  created_at: string;
  updated_at: string;
  observaciones: string | null;
  vendedor_nombre: string;
  metodo_pago_nombre: string;
  cliente_nombre: string;
  detalles: VentaDetalleItem[];
}

export type UpdateVentaRequest = {
  id: string;
  body: Partial<VentaEditFormValues>;
};

export type VentasListResponse = StandardResponse<PaginatedData<Venta>>;
export type VentaDetailResponse = StandardResponse<VentaDetail>;
