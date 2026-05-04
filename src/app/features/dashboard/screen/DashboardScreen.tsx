import { AlertTriangle, ClipboardList, DollarSign, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DashboardHeader,
  DashboardLatestSalesTable,
  DashboardMetricCard,
  DashboardRecentOrdersTable,
  DashboardSalesChart,
  DashboardSkeleton,
  DashboardStockCriticalTable,
} from "../components";
import { formatBs } from "../components/dashboardFormatters";
import { useGetDashboardKpisQuery } from "../store";

export function DashboardScreen() {
  const { data, isFetching, isError, refetch } = useGetDashboardKpisQuery();

  if (isFetching && !data) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Card className="rounded-2xl border-rose-200 bg-rose-50/40">
          <CardContent className="flex flex-col items-start gap-4 pt-6">
            <div className="inline-flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-semibold">No se pudo cargar el dashboard.</p>
            </div>
            <Button onClick={() => refetch()} className="bg-rose-600 hover:bg-rose-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metricas = data?.metricas ?? {
    ventas_hoy: 0,
    cantidad_ventas_hoy: 0,
    pedidos_pendientes: 0,
    productos_stock_critico: 0,
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader onRefresh={refetch} isRefreshing={isFetching} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          title="Ventas hoy"
          value={formatBs(metricas.ventas_hoy)}
          icon={DollarSign}
          helperText="Ingresos registrados durante el día"
          tone="emerald"
        />
        <DashboardMetricCard
          title="Ventas realizadas hoy"
          value={metricas.cantidad_ventas_hoy}
          icon={ShoppingCart}
          helperText="Operaciones completadas hoy"
          tone="sky"
        />
        <DashboardMetricCard
          title="Pedidos pendientes"
          value={metricas.pedidos_pendientes}
          icon={ClipboardList}
          helperText="Pedidos que requieren seguimiento"
          tone="amber"
        />
        <DashboardMetricCard
          title="Stock crítico"
          value={metricas.productos_stock_critico}
          icon={AlertTriangle}
          helperText="Productos bajo mínimo"
          tone="rose"
        />
      </section>

      <DashboardSalesChart data={data?.ventas_ultimos_7_dias || []} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DashboardStockCriticalTable rows={data?.stock_critico || []} />
        <DashboardLatestSalesTable rows={data?.ultimas_ventas || []} />
      </section>

      <DashboardRecentOrdersTable rows={data?.pedidos_recientes || []} />
    </div>
  );
}
