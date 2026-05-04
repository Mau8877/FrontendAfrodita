import { Button } from "@/components/ui/button";
import { CalendarDays, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  isRefreshing?: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  isRefreshing = false,
  onRefresh,
}: DashboardHeaderProps) {
  const now = new Date();
  const lastUpdate = now.toLocaleString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/80 to-violet-50/20 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Dashboard <span className="text-secondary">AFRODITA</span>
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Resumen operativo del sistema
          </p>
          <p className="max-w-2xl text-sm text-slate-500">
            Monitorea ventas, pedidos, inventario y actividad reciente desde un
            solo lugar.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays className="h-4 w-4" />
            Última actualización: {lastUpdate}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-slate-300 bg-white"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>
    </section>
  );
}
