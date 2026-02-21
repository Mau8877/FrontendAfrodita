import * as z from "zod";

const telefonoSchema = z.object({
  id: z.string().uuid().optional().nullable(), 
  tipo: z.string().min(1, "Requerido").max(20, "El tipo es demasiado largo (máx 20)"),
  numero: z.string().min(7, "Requerido").max(20, "El número es demasiado largo (máx 20)"),
});

const direccionSchema = z.object({
  id: z.string().uuid().optional().nullable(), 
  direccion_exacta: z.string().min(5, "Dirección muy corta").max(255),
  es_principal: z.boolean().default(false),
});

export const userEditSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(50),
  email: z.string().email("Email inválido").max(255),
  is_active: z.boolean().default(true),
  id_rol: z.string().uuid("Debe seleccionar un rol válido").optional(),
  perfil: z.object({
    nombre: z.string().max(100).nullable().default(""),
    apellido: z.string().max(100).nullable().default(""),
    fecha_nacimiento: z.union([
      z.string().length(0), // Permite string vacío
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato debe ser YYYY-MM-DD")
    ]).optional().nullable().transform(e => e === "" ? null : e),
    puntos_fidelidad: z.number().default(0),
  }),
  telefonos: z.array(telefonoSchema).default([]),
  direcciones: z.array(direccionSchema).default([]),
});

export const userCreateSchema = userEditSchema.extend({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  id_rol: z.string().uuid("Debe seleccionar un rol válido").optional(),
});

export type UserEditFormValues = z.infer<typeof userEditSchema>;
export type UserCreateFormValues = z.infer<typeof userCreateSchema>;