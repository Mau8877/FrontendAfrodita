import * as z from "zod";

export const shippingRateSchema = z.object({
  id_sucursal: z.string().uuid("Debes seleccionar una sucursal válida"),
  distancia_min: z.coerce.number().min(0, "Mínimo 0 km"),
  distancia_max: z.coerce.number().min(0, "Mínimo 0 km"),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  es_local: z.boolean().default(true),
}).refine((data) => {
  // Si no es local (Nacional), permitimos 0-0
  if (!data.es_local) return true;
  // Si es local, validamos que el rango sea lógico
  return data.distancia_max > data.distancia_min;
}, {
  message: "La distancia máxima debe ser mayor a la mínima en envíos locales",
  path: ["distancia_max"],
});

export type ShippingRateFormValues = z.infer<typeof shippingRateSchema>;