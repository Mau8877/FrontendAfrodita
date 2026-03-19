import * as z from "zod";

export const productSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "Nombre demasiado largo"),
  
  sku: z
    .string()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(50, "SKU demasiado largo"),
  
  descripcion: z
    .string()
    .max(1000, "Descripción demasiado larga (máximo 1000 caracteres)")
    .optional()
    .or(z.literal("")),

  precio_venta: z.coerce
    .number()
    .positive("El precio debe ser mayor a 0")
    .multipleOf(0.01, "Máximo 2 decimales"),
  
  stock_minimo: z.coerce
    .number()
    .int("Debe ser un número entero")
    .nonnegative("No puede ser negativo")
    .default(3),
  
  id_tipo: z.string().uuid("Seleccione un tipo válido"),
  id_marca: z.string().uuid("Seleccione una marca válida"),
  id_categoria: z.string().uuid("Seleccione una categoría válida"),
  
  colores_ids: z
    .array(z.string().uuid("ID de color inválido"))
    .min(1, "Debe seleccionar al menos un color"),
  
  tonos_ids: z
    .array(z.string().uuid("ID de tono inválido"))
    .min(1, "Debe seleccionar al menos un tono para el catálogo"),

  imagenes_upload: z
    .array(
      z.object({
        imagen: z.union([
          z.instanceof(File),
          z.string().url(),
          z.null(),
        ]),
        es_principal: z.boolean().default(false),
      })
    )
    .optional()
    .default([]),
  
  is_visible: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;