import * as z from "zod";

export const ventaEditSchema = z.object({
  estado: z.enum(["PENDIENTE", "COMPLETADO", "CANCELADO"]),
  observaciones: z
    .string()
    .max(1000, "Las observaciones no pueden exceder 1000 caracteres")
    .optional()
    .nullable(),
});

export type VentaEditFormValues = z.infer<typeof ventaEditSchema>;
