import type { VentaFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// ==========================================
// --- MODELOS DE DATOS (DOMINIO) ---
// ==========================================

export interface MetodoPago {
  id: string;
  nombre: string;
  tipo: 'DIRECTO' | 'ONLINE';
}

export interface Venta {
  id: string;
  estado: 'SOLICITADO_WSP' | 'CONFIRMADO' | 'ENTREGADO' | 'ANULADO';
  total_productos: number;
  total_envio: number;
  total_general: number;
  created_at: string;
  vendedor_nombre: string;
  metodo_pago_nombre: string;
  observaciones: string | null;
}

// Estructura exacta del JSON guardado en el backend
export interface PedidoJsonData {
  cliente: {
    id_auth: string | null;
    nombre_reserva: string;
  };
  productos: Array<{
    id_producto: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
  entrega: {
    metodo: string;
    id_tarifa: string | null;
    costo_envio: number;
    latitud: number | null;
    longitud: number | null;
    referencia: string;
    distancia_km: number;
  };
  totales: {
    subtotal_productos: number;
    total_general: number;
  };
}

export interface PedidoTemporal {
  id: string;
  codigo: string;
  datos_json: string; // Ojo: A veces Django lo manda como string (necesita JSON.parse) o ya como objeto dependiendo de tu config de DRF. Si DRF lo parsea, cambia esto a PedidoJsonData
  estado: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO';
  created_at: string;
}

// ==========================================
// --- TIPOS PARA PETICIONES (REQUESTS) ---
// ==========================================

// Para crear la venta enviamos exactamente lo que valida el Schema
export type CreateVentaRequest = VentaFormValues;

// ==========================================
// --- TIPOS PARA RESPUESTAS (RESPONSES) ---
// ==========================================

// Respuesta al crear una venta exitosamente (basado en el JSON que armamos en views.py)
export interface VentaCreateResponse {
  success: boolean;
  id_venta?: string;
  total_general?: number;
  mensaje?: string;
  data?: Venta;
  errors?: any;
}

export type MetodosPagoResponse = StandardResponse<MetodoPago[]>;
export type VentasListResponse = StandardResponse<PaginatedData<Venta>>;
export type PedidoDetailResponse = PedidoTemporal; // El GET del pedido devuelve el objeto directo