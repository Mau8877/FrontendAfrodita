import * as z from "zod";

/**
 * Esquema para cada item individual de la compra.
 */
export const replenishmentDetailSchema = z.object({
  id_producto: z.string().uuid("Producto inválido"),
  cantidad: z.number().int().min(1, "Mínimo 1 unidad"),
  precio_costo_manual: z
    .number()
    .min(0.01, "El costo debe ser mayor a 0")
    .optional(),
  ano_vencimiento: z
    .number()
    .int()
    .min(2024, "Año no válido")
    .max(2100, "Año demasiado lejano"),
});

/**
 * Esquema principal para la reposición de stock.
 * .default(true) en auto_prorate ayuda a Zod, 
 * pero la interfaz manual es la que convence a TS.
 */
export const replenishmentSchema = z.object({
  id_proveedor: z.string().uuid("Seleccione un proveedor válido"),
  total_operacion: z.number().min(0.1, "El total debe ser mayor a 0"),
  auto_prorate: z.boolean().default(true),
  detalles: z
    .array(replenishmentDetailSchema)
    .min(1, "Debe añadir al menos un producto a la reposición"),
});

/**
 * TIPOS INFERIDOS (Zod Original)
 */
export type ReplenishmentFormValues = z.infer<typeof replenishmentSchema>;
export type ReplenishmentDetailValues = z.infer<typeof replenishmentDetailSchema>;

/**
 * INTERFAZ DE CONTRATO (Solución a errores de TS en useForm)
 * Esta interfaz "aplana" los tipos para que useForm y el Resolver 
 * no tengan discrepancias con los campos opcionales o booleanos.
 */
export interface ReplenishmentRequiredValues {
  id_proveedor: string;
  total_operacion: number;
  auto_prorate: boolean;
  detalles: {
    id_producto: string;
    cantidad: number;
    precio_costo_manual?: number;
    ano_vencimiento: number;
  }[];
}