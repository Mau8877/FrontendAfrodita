import type { SupplierFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---
export interface Supplier {
  id: string;
  nombre: string;
  telefono: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---
export type CreateSupplierRequest = FormData | SupplierFormValues;

export type UpdateSupplierRequest = {
  id: string;
  body: Partial<SupplierFormValues> | { restore: boolean } | FormData;
};

export type SuppliersListResponse = StandardResponse<PaginatedData<Supplier>>;
export type SupplierResponse = StandardResponse<Supplier>;