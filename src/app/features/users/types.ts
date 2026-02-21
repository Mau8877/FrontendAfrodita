import type { UserCreateFormValues, UserEditFormValues } from "./schemas";

// --- ESTRUCTURAS DE RESPUESTA DEL BACKEND ---

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- MODELOS DE DATOS (DOMINIO) ---

export interface Perfil {
  nombre: string | null;
  apellido: string | null;
  fecha_nacimiento: string | null;
  puntos_fidelidad: number;
}

export interface Telefono {
  id?: string; // ID opcional para sincronización
  numero: string;
  tipo: string; 
}

export interface Direccion {
  id?: string; // ID opcional para sincronización
  direccion_exacta: string;
  referencias?: string | null;
  es_principal: boolean;
}

// --- TIPOS DE ROLES ---
export interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface RolesListResponse {
  success: boolean;
  message: string;
  data: Role[] | { results: Role[] }; 
}

// --- INTERFAZ PRINCIPAL DE USUARIO ---

export interface User {
  id: string;
  username: string;
  email: string;
  id_rol: string;
  rol_nombre: string;   
  is_active: boolean;
  is_staff: boolean;    
  created_at: string;    
  deleted_at: string | null;
  perfil: Perfil | null;
  telefonos: Telefono[];
  direcciones: Direccion[];
}

// --- TIPOS PARA PETICIONES (REQUESTS) ---

export type CreateUserRequest = UserCreateFormValues;

export type UpdateUserRequest = {
  id: string;
  body: UserEditFormValues;
};

export type UsersListResponse = StandardResponse<PaginatedData<User>>;
export type UserResponse = StandardResponse<User>;