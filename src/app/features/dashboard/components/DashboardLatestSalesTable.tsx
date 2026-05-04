import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { DashboardUltimaVentaItem } from "../types";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardSectionCard } from "./DashboardSectionCard";
import { StatusBadge } from "./StatusBadge";
import { formatBs, formatDateTime } from "./dashboardFormatters";

interface DashboardLatestSalesTableProps {
  rows: DashboardUltimaVentaItem[];
}

export function DashboardLatestSalesTable({ rows }: DashboardLatestSalesTableProps) {
  return (
    <DashboardSectionCard
      title="Últimas ventas"
      description="Actividad comercial más reciente del sistema."
      action={
        <Button asChild variant="outline" size="sm" className="border-slate-300 bg-white px-2.5 text-[11px]">
          <Link to="/admin/sales/sales-history">Ver historial de ventas</Link>
        </Button>
      }
    >
      {rows.length === 0 ? (
        <DashboardEmptyState message="Sin ventas recientes." />
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.venta_id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:bg-slate-50/70"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800" title={row.cliente || "Sin cliente"}>
                  {row.cliente || "Sin cliente"}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Venta #{String(row.venta_id).slice(0, 8)} · {formatDateTime(row.fecha)}
                </p>
              </div>

              <div className="flex items-center gap-2 self-center justify-self-end">
                <span className="whitespace-nowrap text-sm font-black text-emerald-700">{formatBs(row.total)}</span>
                <StatusBadge status={row.estado} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSectionCard>
  );
}
