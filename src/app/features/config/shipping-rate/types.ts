import type { StandardResponse, PaginatedData } from '@/app/common.types';
import type { ShippingRateFormValues } from "./schemas";

export interface ShippingRate {
  id: string;
  id_sucursal: string;
  sucursal_nombre: string; 
  distancia_min: string; 
  distancia_max: string;
  precio: string;
  es_local: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreateShippingRateRequest = ShippingRateFormValues;

export type UpdateShippingRateRequest = {
  id: string;
  body: Partial<ShippingRateFormValues> | { restore: boolean };
};

export type ShippingRateListResponse = StandardResponse<PaginatedData<ShippingRate>>;
export type ShippingRateResponse = StandardResponse<ShippingRate>;