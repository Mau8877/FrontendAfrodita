import type { BrandFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---
export interface Brand {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---

// Para crear una marca, a veces usamos FormData si enviamos el archivo directamente
export type CreateBrandRequest = FormData | BrandFormValues;

export type UpdateBrandRequest = {
  id: string;
  body: Partial<BrandFormValues> | { restore: boolean } | FormData;
};

export type BrandsListResponse = StandardResponse<PaginatedData<Brand>>;
export type BrandResponse = StandardResponse<Brand>;