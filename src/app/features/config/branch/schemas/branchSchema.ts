import * as z from "zod";

export const branchSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre demasiado largo"),
  direccion_fisica: z
    .string()
    .min(10, "La dirección debe ser más descriptiva"),
  latitud: z.coerce.string().nullable().optional().default(""),
  longitud: z.coerce.string().nullable().optional().default(""),
});

export type BranchFormValues = z.infer<typeof branchSchema>;