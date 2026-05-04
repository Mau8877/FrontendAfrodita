export interface DashboardMetricas {
  ventas_hoy: number;
  cantidad_ventas_hoy: number;
  pedidos_pendientes: number;
  productos_stock_critico: number;
}

export interface DashboardVentaUltimos7DiasItem {
  fecha: string;
  total_vendido: number;
  cantidad_ventas: number;
}

export interface DashboardStockCriticoItem {
  producto_id: string;
  producto: string;
  stock_actual: number;
  stock_minimo: number;
}

export interface DashboardUltimaVentaItem {
  venta_id: string;
  cliente: string | null;
  total: number;
  estado: string;
  fecha: string;
}

export interface DashboardPedidoRecienteItem {
  pedido_id: string;
  cliente: string | null;
  estado: string;
  fecha: string;
}

export interface DashboardKpisResponse {
  metricas: DashboardMetricas;
  ventas_ultimos_7_dias: DashboardVentaUltimos7DiasItem[];
  stock_critico: DashboardStockCriticoItem[];
  ultimas_ventas: DashboardUltimaVentaItem[];
  pedidos_recientes: DashboardPedidoRecienteItem[];
}
