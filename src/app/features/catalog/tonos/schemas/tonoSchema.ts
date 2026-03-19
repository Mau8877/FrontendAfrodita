import * as z from "zod";

// Schema para los Tonos (Filtros)
export const tonoSchema = z.object({
  nombre: z.string()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
});

export type TonoFormValues = z.infer<typeof tonoSchema>;