import type { ColorFormValues, FamiliaColorFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO) ---
export interface FamiliaColor {
  id: string;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Color {
  id: string;
  id_familia: string | null;
  nombre_familia: string | null;
  nombre: string;
  codigo_hex: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---
export type CreateColorRequest = FormData | ColorFormValues;
export type CreateFamiliaRequest = FormData | FamiliaColorFormValues;

export type UpdateColorRequest = {
  id: string;
  body: Partial<ColorFormValues> | { restore: boolean } | FormData;
};

export type UpdateFamiliaRequest = {
  id: string;
  body: Partial<FamiliaColorFormValues> | { restore: boolean } | FormData;
};

// --- RESPUESTAS API ---
export type ColorsListResponse = StandardResponse<PaginatedData<Color>>;
export type FamiliaListResponse = StandardResponse<PaginatedData<FamiliaColor>>;
export type ColorResponse = StandardResponse<Color>;
export type FamiliaResponse = StandardResponse<FamiliaColor>;