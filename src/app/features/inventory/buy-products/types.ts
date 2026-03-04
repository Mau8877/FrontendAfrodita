import type { ReplenishmentFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---

export interface PurchaseDetail {
  id: string;
  id_producto: string;
  nombre_producto: string;
  nro_lote: string;
  cantidad: number;
  precio_costo: string; // Viene como string desde el Decimal de Django
}

export interface Replenishment {
  id: string;
  fecha_compra: string;
  total: string;
  unidades: number;
  estado: 'COMPLETADO' | 'ANULADO';
  nombre_proveedor: string;
  nombre_usuario?: string;
  detalles?: PurchaseDetail[]; // Solo viene en el GET por ID
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---

export type CreateReplenishmentRequest = ReplenishmentFormValues;

export type ReplenishmentListResponse = StandardResponse<PaginatedData<Replenishment>>;
export type ReplenishmentResponse = StandardResponse<Replenishment>;