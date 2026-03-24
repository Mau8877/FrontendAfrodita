// ============================================================================
// TIPOS DE DELIVERY Y CHECKOUT
// ============================================================================

export type DeliveryMethod = 'pickup' | 'delivery'

// Lo que enviamos al Backend
export interface DeliveryRateRequest {
  latitud: number;
  longitud: number;
}

// Lo que nos responde el Backend (dentro de data)
export interface DeliveryRateResponse {
  distancia_km: number;
  costo_envio: number;
  mensaje: string;
  requiere_coordinacion: boolean;
  id_tarifa: string | null;
}

// Estructura del Store local en Zustand
export interface DeliveryState {
  method: DeliveryMethod;
  coordinates: { lat: number; lng: number } | null;
  addressReference: string;
  rateData: DeliveryRateResponse | null;
  
  // Acciones
  setMethod: (method: DeliveryMethod) => void;
  setCoordinates: (lat: number, lng: number) => void;
  setAddressReference: (ref: string) => void;
  setRateData: (data: DeliveryRateResponse | null) => void;
  resetDelivery: () => void;
}

// ============================================================================
// PEDIDOS
// ============================================================================
export interface PedidoItemRequest {
  id: string;      // UUID del producto
  cantidad: number;
}

export interface PedidoEntregaRequest {
  metodo: 'pickup' | 'delivery';
  id_tarifa?: string; // UUID de la tarifa calculada
  latitud?: number;
  longitud?: number;
  referencia?: string;
  costo_envio: number;
  distancia_km?: number;
}

export interface CreatePedidoRequest {
  nombre_cliente?: string;
  items: PedidoItemRequest[];
  entrega: PedidoEntregaRequest;
}

// Lo que nos devuelve el Backend (la data "congelada")
export interface PedidoResponse {
  id: string;
  codigo: string; // El código de 6 dígitos (3B24AC)
  datos_json: unknown; // El objeto completo hidratado
  estado: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO';
  created_at: string;
}

export interface PedidoCreateSuccess {
  success: boolean;
  codigo: string;
  total: number;
  data: PedidoResponse;
}