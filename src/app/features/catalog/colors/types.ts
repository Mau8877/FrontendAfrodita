import type { ColorFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---
export interface Color {
  id: string;
  nombre: string;
  codigo_hex: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---
export type CreateColorRequest = FormData | ColorFormValues;

export type UpdateColorRequest = {
  id: string;
  body: Partial<ColorFormValues> | { restore: boolean } | FormData;
};

// --- RESPUESTAS API ---
export type ColorsListResponse = StandardResponse<PaginatedData<Color>>;
export type ColorResponse = StandardResponse<Color>;