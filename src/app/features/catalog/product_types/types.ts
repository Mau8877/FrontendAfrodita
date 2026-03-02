import type { ProductTypeFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---
export interface ProductType {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---
export type CreateProductTypeRequest = FormData | ProductTypeFormValues;

export type UpdateProductTypeRequest = {
  id: string;
  body: Partial<ProductTypeFormValues> | { restore: boolean } | FormData;
};

export type ProductTypeListResponse = StandardResponse<PaginatedData<ProductType>>;
export type ProductTypeResponse = StandardResponse<ProductType>;