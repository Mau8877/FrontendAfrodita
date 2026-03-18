import { z } from 'zod';

// --- REGISTER SCHEMA ---
export const registerSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  password_confirm: z.string().min(1, "Confirma tu contraseña"),
  // Campos opcionales
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  telefono: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirm"],
});

// Inferimos los tipos para uso en formularios
export type RegisterFormValues = z.infer<typeof registerSchema>;