export type VentaPeriodoAgrupado = "dia" | "semana" | "mes";

export interface CompraProveedorReporteItem {
  proveedor_id: number;
  proveedor: string;
  monto_comprado: number;
  cantidad_compras: number;
  unidades_compradas: number;
}

export interface ProductoMasVendidoReporteItem {
  producto_id: number;
  producto: string;
  categoria: string | null;
  marca: string | null;
  unidades_vendidas: number;
  ingreso_generado: number;
}

export interface StockCriticoReporteItem {
  producto_id: number;
  producto: string;
  stock_actual: number;
  stock_minimo: number;
  estado: string;
}

export interface VentaPeriodoSerieItem {
  periodo: string;
  total_vendido: number;
  cantidad_ventas: number;
  ticket_promedio: number;
}

export interface VentaPeriodoReporteResponse {
  resumen: {
    total_vendido: number;
    cantidad_ventas: number;
    ticket_promedio: number;
  };
  series: VentaPeriodoSerieItem[];
}

export interface VentaSucursalReporteItem {
  sucursal_id: number | null;
  sucursal: string;
  total_vendido: number;
  cantidad_ventas: number;
  ticket_promedio: number;
}
