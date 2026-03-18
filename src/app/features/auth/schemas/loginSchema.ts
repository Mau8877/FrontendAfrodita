import { z } from 'zod';

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

// Inferimos los tipos para uso en formularios
export type LoginFormValues = z.infer<typeof loginSchema>;