import * as z from "zod";

// --- ESQUEMA DEL DETALLE DE VENTA ---
export const ventaDetalleSchema = z.object({
  id_producto: z.string().uuid(),
  nombre: z.string().optional(), // <--- Añadir para la UI
  cantidad: z.number().int().min(1),
  precio_final: z.number().min(0),
  subtotal: z.number().optional(), // <--- Añadir para la UI
});

// --- ESQUEMA PRINCIPAL DE VENTA ---
export const ventaSchema = z.object({
  id_cliente: z.string().uuid().optional().nullable(),
  id_sucursal: z.string().uuid({ message: "Debe seleccionar una sucursal" }),
  id_metodo_pago: z.string().uuid({ message: "Debe seleccionar un método de pago" }),
  
  total_productos: z.number().min(0),
  total_envio: z.number().min(0),
  total_general: z.number().min(0),
  
  detalles: z.array(ventaDetalleSchema).min(1, "Debe haber al menos un producto en la venta"),
  
  id_pedido: z.string().uuid().optional().nullable(), // ID del pedido si viene de WhatsApp
  observaciones: z.string().optional().nullable(),
});

// Tipos inferidos de los esquemas
export type VentaFormValues = z.infer<typeof ventaSchema>;
export type VentaDetalleFormValues = z.infer<typeof ventaDetalleSchema>;