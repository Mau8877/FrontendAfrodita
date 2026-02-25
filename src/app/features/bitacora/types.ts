/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StandardResponse, PaginatedData } from '@/app/common.types';

export interface BitacoraAccion {
  id: string;
  usuario_id: string;
  usuario_username: string;
  usuario_email: string;
  usuario_rol: string;
  
  tabla: string;
  accion: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESTORE';
  ip_address: string | null;
  data_antes: any; 
  data_despues: any;
  fecha_hora: string;
  id_login?: string | null;
}

export interface LoginLog {
  id: string;
  id_usuario: string;
  usuario_username: string;
  usuario_email: string;
  usuario_rol: string;
  ip_address_login: string | null;
  ip_address_logout: string | null;
  user_agent: string | null;
  exito: boolean;
  fecha_login: string;
  fecha_logout: string | null;
  acciones?: BitacoraAccion[];
}

// --- RESPUESTAS PARA LOGIN LOGS ---
export type LoginLogsListResponse = StandardResponse<PaginatedData<LoginLog>>;
export type LoginLogResponse = StandardResponse<LoginLog>;

// --- RESPUESTAS PARA ACTION LOGS (BITÁCORA) ---
export type ActionLogsListResponse = StandardResponse<PaginatedData<BitacoraAccion>>;

// --- FILTROS ---
export interface LoginLogsFilters {
  page?: number;
  search?: string;
  exito?: boolean;
  id_usuario?: string;
  ordering?: string;
}

export interface ActionLogsFilters {
  page?: number;
  search?: string;
  accion?: string;
  tabla?: string;
  id_usuario?: string;
  ordering?: string;
}