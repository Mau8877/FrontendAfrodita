import type { StandardResponse, PaginatedData } from '@/app/common.types';
import type { BranchFormValues } from "./schemas";

export interface Branch {
  id: string;
  nombre: string;
  direccion_fisica: string;
  latitud: string | null; 
  longitud: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreateBranchRequest = BranchFormValues;

export type UpdateBranchRequest = {
  id: string;
  body: Partial<BranchFormValues> | { restore: boolean };
};

export type BranchListResponse = StandardResponse<PaginatedData<Branch>>;
// Usado para selectores ligeros (por ejemplo, elegir sucursal de retiro)
export type BranchSimpleResponse = StandardResponse<Pick<Branch, 'id' | 'nombre' | 'direccion_fisica'>[]>;
export type BranchResponse = StandardResponse<Branch>;