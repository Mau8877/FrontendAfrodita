import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardPedidoRecienteItem } from "../types";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardSectionCard } from "./DashboardSectionCard";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "./dashboardFormatters";

interface DashboardRecentOrdersTableProps {
  rows: DashboardPedidoRecienteItem[];
}

export function DashboardRecentOrdersTable({ rows }: DashboardRecentOrdersTableProps) {
  return (
    <DashboardSectionCard
      title="Pedidos recientes"
      description="Seguimiento de pedidos para validación y despacho."
      action={
        <Button asChild variant="outline" size="sm" className="border-slate-300 bg-white px-2.5 text-[11px]">
          <Link to="/admin/sales/orders">Ver pedidos</Link>
        </Button>
      }
    >
      {rows.length === 0 ? (
        <DashboardEmptyState message="Sin pedidos recientes." />
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[16%]">Pedido</TableHead>
              <TableHead className="w-[34%]">Cliente</TableHead>
              <TableHead className="w-[20%]">Estado</TableHead>
              <TableHead className="w-[30%]">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.pedido_id} className="hover:bg-slate-50/70">
                <TableCell className="truncate py-2 font-mono text-[11px] font-semibold text-secondary">{String(row.pedido_id).slice(0, 8)}</TableCell>
                <TableCell className="truncate whitespace-normal py-2 font-medium text-slate-700" title={row.cliente || "Sin cliente"}>
                  {row.cliente || "Sin cliente"}
                </TableCell>
                <TableCell className="py-2">
                  <StatusBadge status={row.estado} />
                </TableCell>
                <TableCell className="truncate py-2 text-xs text-slate-500">{formatDateTime(row.fecha)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DashboardSectionCard>
  );
}
