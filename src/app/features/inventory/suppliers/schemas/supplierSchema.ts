import * as z from "zod";

export const supplierSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "Nombre demasiado largo"),
  telefono: z
    .string()
    .max(20, "El teléfono no puede exceder los 20 caracteres")
    .optional()
    .nullable()
    .default(""),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;