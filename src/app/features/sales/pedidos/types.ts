import type { PaginatedData, StandardResponse } from "@/app/common.types";
import type { PedidoEditFormValues } from "./schemas";

export interface Pedido {
  id: string;
  codigo: string;
  datos_json: {
    cliente?: {
      id_auth?: string | null;
      nombre_reserva?: string;
    };
    productos?: Array<{
      id_producto: string;
      nombre: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
    }>;
    entrega?: {
      metodo?: string;
      id_tarifa?: string | null;
      costo_envio?: number;
      latitud?: number | null;
      longitud?: number | null;
      referencia?: string;
      distancia_km?: number;
    };
    totales?: {
      subtotal_productos?: number;
      total_general?: number;
    };
  };
  estado: "PENDIENTE" | "COMPLETADO" | "EN_CAMINO" | "CANCELADO";
  cliente_nombre: string | null;
  total_general: number | null;
  cantidad_items: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreatePedidoRequest = {
  nombre_cliente: string;
  items: Array<{ id: string; cantidad: number }>;
  entrega: Record<string, unknown>;
};

export type UpdatePedidoRequest = {
  id: string;
  body: Partial<PedidoEditFormValues> | { restore: boolean };
};

export type PedidosListResponse = StandardResponse<PaginatedData<Pedido>>;
export type PedidoResponse = StandardResponse<Pedido>;
