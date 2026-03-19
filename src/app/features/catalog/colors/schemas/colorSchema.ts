import * as z from "zod";

// Schema para los Colores (Limpio e independiente)
export const colorSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(50),
  codigo_hex: z
    .string()
    .max(7)
    .regex(/^#?[A-Fa-f0-9]{6}$|^#?[A-Fa-f0-9]{3}$/, "Formato inválido")
    .optional()
    .transform((val) => (val && !val.startsWith("#") ? `#${val}` : val)),
});

export type ColorFormValues = z.infer<typeof colorSchema>;