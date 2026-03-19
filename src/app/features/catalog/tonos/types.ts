// 1. Importamos primero para poder usarlo AQUÍ ABAJO
import type { TonoFormValues } from "./schemas"; 
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// 2. Y ahora lo EXPORTAMOS para que otros archivos (como el API o Modales) lo vean
export type { TonoFormValues };

// --- MODELO DE DATOS (DOMINIO) ---
export interface Tono {
  id: string;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---
export type CreateTonoRequest = TonoFormValues;

export type UpdateTonoRequest = {
  id: string;
  body: Partial<TonoFormValues> | { restore: boolean };
};

// --- RESPUESTAS API ---
export type TonosListResponse = StandardResponse<PaginatedData<Tono>>;
export type TonoResponse = StandardResponse<Tono>;