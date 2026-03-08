import * as z from "zod";

export const paymentMethodSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  tipo: z.string().refine((val) => val === "DIRECTO" || val === "ONLINE", {
    message: "Seleccione un tipo válido (DIRECTO u ONLINE)",
  }) as z.ZodType<"DIRECTO" | "ONLINE">,
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;