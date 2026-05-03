import * as z from "zod";

export const pedidoCreateSchema = z.object({
  nombre_cliente: z.string().min(2, "Ingrese al menos 2 caracteres").max(120, "Nombre demasiado largo"),
  items_json: z.string().min(2, "Debes ingresar un JSON válido de items"),
  entrega_json: z.string().min(2, "Debes ingresar un JSON válido de entrega"),
});

export const pedidoEditSchema = z.object({
  estado: z.enum(["PENDIENTE", "COMPLETADO", "EN_CAMINO", "CANCELADO"]),
});

export type PedidoCreateFormValues = z.infer<typeof pedidoCreateSchema>;
export type PedidoEditFormValues = z.infer<typeof pedidoEditSchema>;
