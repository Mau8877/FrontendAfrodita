// ==========================================
// API & DATA INTERFACES 📡
// ==========================================

export interface User {
  user_id: string;
  username: string;
  email: string;
  rol: string;
}

// Estructura para el registro 
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access: string;
    refresh: string;
    user: User;
    session_id: string;
  };
  errors?: Record<string, string[]>;
}

export interface LogoutRequest {
  session_id: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}