import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---

export interface LoteStock {
  id: string;
  nro_lote: string;
  cantidad_actual: number;
  ano_vencimiento: number;
  costo_unitario: string;
}

export interface ProductStock {
  id: string;
  nombre: string;
  sku: string;
  marca_nombre: string;
  total_stock: number;
}

export interface ProductStockDetail extends ProductStock {
  lotes_activos: LoteStock[];
}

// --- TIPOS PARA RESPUESTAS (RESPONSES) ---

export type StockListResponse = StandardResponse<PaginatedData<ProductStock>>;
export type StockDetailResponse = StandardResponse<ProductStockDetail>;