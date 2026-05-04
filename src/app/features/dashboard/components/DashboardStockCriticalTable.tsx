import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardStockCriticoItem } from "../types";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardSectionCard } from "./DashboardSectionCard";

interface DashboardStockCriticalTableProps {
  rows: DashboardStockCriticoItem[];
}

const getUrgencyBadge = (stockActual: number, stockMinimo: number) => {
  if (stockActual <= 0) return { label: "Sin stock", className: "bg-rose-100 text-rose-700 border-rose-200" };
  if (stockActual === stockMinimo) return { label: "Al límite", className: "bg-amber-100 text-amber-700 border-amber-200" };
  return { label: "Crítico", className: "bg-orange-100 text-orange-700 border-orange-200" };
};

export function DashboardStockCriticalTable({ rows }: DashboardStockCriticalTableProps) {
  const summaryRows = rows.slice(0, 5);

  return (
    <DashboardSectionCard
      title="Stock crítico"
      description="Productos con nivel de inventario bajo o agotado."
      action={
        <Button asChild variant="outline" size="sm" className="border-slate-300 bg-white px-2.5 text-[11px]">
          <Link to="/admin/reports/stock-critico">Ver reporte completo</Link>
        </Button>
      }
    >
      {summaryRows.length === 0 ? (
        <DashboardEmptyState message="Todo en orden. No hay productos con stock crítico." />
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44%]">Producto</TableHead>
              <TableHead className="w-[14%] px-1">Actual</TableHead>
              <TableHead className="w-[14%] px-1">Mínimo</TableHead>
              <TableHead className="w-[28%]">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryRows.map((row) => {
              const urgency = getUrgencyBadge(row.stock_actual, row.stock_minimo);
              return (
                <TableRow key={row.producto_id} className="hover:bg-slate-50/70">
                  <TableCell className="truncate whitespace-normal py-2 font-semibold text-slate-800" title={row.producto}>
                    {row.producto}
                  </TableCell>
                  <TableCell className="px-1 py-2 text-center">{row.stock_actual}</TableCell>
                  <TableCell className="px-1 py-2 text-center">{row.stock_minimo}</TableCell>
                  <TableCell className="py-2">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${urgency.className}`}>
                      {urgency.label}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </DashboardSectionCard>
  );
}
