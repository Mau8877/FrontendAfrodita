import { z } from 'zod'

// ==========================================
// 1. ZOD SCHEMAS (Para Formularios) 📝
// ==========================================

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
})

// Inferimos el tipo de TS automáticamente
export type LoginFormValues = z.infer<typeof loginSchema>


// --- REGISTER SCHEMA ---
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"), // Ajusta según tu Django
  password_confirm: z
    .string()
    .min(1, "Debes confirmar la contraseña"),
}).refine((data) => data.password === data.password_confirm, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirm"], // Esto marca el error en el campo correcto
})

export type RegisterFormValues = z.infer<typeof registerSchema>


// ==========================================
// 2. API INTERFACES (Para Backend) 📡
// ==========================================

// La estructura del usuario que devuelve Django
export interface User {
  user_id: string
  username: string
  email: string
  rol: string
}

// La estructura de la respuesta de Autenticación (Login/Refresh)
// Basada en tu 'standard_response'
export interface AuthResponse {
  success: boolean
  message: string
  data: {
    access: string
    refresh: string
    user: User
    session_id: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, string[]> | any
}

export interface LogoutRequest {
  session_id: string;
}

// La estructura para cuando falla el registro (o cualquier error 400)
export interface ApiErrorResponse {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}