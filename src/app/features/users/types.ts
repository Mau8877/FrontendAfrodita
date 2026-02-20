// Estructura base de la respuesta del Backend
export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

// Data específica de paginación que manda AfroditaBaseView
export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Perfil {
  nombre: string;
  apellido: string;
  fecha_nacimiento: string | null;
  puntos_fidelidad: number;
}

export interface Telefono {
  numero: string;
  tipo: string; 
}

export interface Direccion {
  id: string;
  direccion_exacta: string;
  referencias: string | null;
  es_principal: boolean;
  id_ciudad: number;
  ciudad_nombre: string; 
}

// --- Interfaz Principal de Usuario ---

export interface User {
  id: string;
  username: string;
  email: string;
  id_rol: number;
  rol_nombre: string;   
  is_active: boolean;
  is_staff: boolean;    
  created_at: string;    
  
  // Relaciones anidadas
  perfil: Perfil | null;
  telefonos: Telefono[];
  direcciones: Direccion[];

}

export type UsersListResponse = StandardResponse<PaginatedData<User>>;
export type UserResponse = StandardResponse<User>;

export type CreateUserRequest = Partial<User>;
export type UpdateUserRequest = Partial<User>;