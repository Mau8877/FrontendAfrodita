import * as z from "zod";

// Schema para las Familias (La tabla de abajo)
export const familiaColorSchema = z.object({
  nombre: z.string()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
});

// Schema para los Colores (Actualizado)
export const colorSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(50),
  id_familia: z.string().uuid("ID de familia inválido").optional().nullable(),
  codigo_hex: z
    .string()
    .max(7)
    .regex(/^#?[A-Fa-f0-9]{6}$|^#?[A-Fa-f0-9]{3}$/, "Formato inválido")
    .optional()
    .transform((val) => (val && !val.startsWith("#") ? `#${val}` : val)),
});

export type ColorFormValues = z.infer<typeof colorSchema>;
export type FamiliaColorFormValues = z.infer<typeof familiaColorSchema>;