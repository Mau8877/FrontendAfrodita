import type { CategoryFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---
export interface Category {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---
export type CreateCategoryRequest = FormData | CategoryFormValues;

export type UpdateCategoryRequest = {
  id: string;
  body: Partial<CategoryFormValues> | { restore: boolean } | FormData;
};

export type CategoriesListResponse = StandardResponse<PaginatedData<Category>>;
export type CategoryResponse = StandardResponse<Category>;