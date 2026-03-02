import * as z from "zod";

export const productTypeSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre demasiado largo"),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .optional()
    .nullable()
    .default(""),
});

export type ProductTypeFormValues = z.infer<typeof productTypeSchema>;