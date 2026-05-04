import { type ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Loader2, ReceiptText, User2 } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetVentaByIdQuery } from "../store";
import type { VentaDetalleItem } from "../types";

interface VentaDetailModalProps {
  ventaId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const columns: ColumnDef<VentaDetalleItem>[] = [
  { accessorKey: "producto_nombre", header: "Producto" },
  { accessorKey: "lote_codigo", header: "Lote" },
  {
    accessorKey: "cantidad",
    header: () => <div className="text-center">Cantidad</div>,
    cell: ({ row }) => <div className="text-center font-bold">{row.original.cantidad}</div>,
  },
  {
    accessorKey: "precio_final",
    header: () => <div className="text-center">Precio Final</div>,
    cell: ({ row }) => <div className="text-center font-mono">Bs. {Number(row.original.precio_final).toFixed(2)}</div>,
  },
];

export function VentaDetailModal({ ventaId, isOpen, onClose }: VentaDetailModalProps) {
  const { data: apiResponse, isFetching, isError } = useGetVentaByIdQuery(ventaId || "", {
    skip: !isOpen || !ventaId,
  });

  // Soporta ambos formatos:
  // 1) StandardResponse => { success, data: {...} }
  // 2) DRF retrieve     => { ...venta }
  const venta = (apiResponse as any)?.data || (apiResponse as any);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-[95vw] bg-white rounded-[2.5rem] overflow-hidden border-none shadow-2xl p-0 flex flex-col">
        <div className="sr-only">
          <DialogTitle>Detalle de Venta</DialogTitle>
          <DialogDescription>Información completa de la venta.</DialogDescription>
        </div>

        {isFetching ? (
          <div className="h-[420px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 animate-pulse">Cargando venta...</span>
          </div>
        ) : isError || !venta ? (
          <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs italic">
            No se pudo obtener el detalle de la venta
          </div>
        ) : (
          <>
            <div className="p-6 border-b bg-primary/5 border-primary/10 text-left">
              <h2 className="text-xl font-black uppercase tracking-tighter text-primary">Venta {venta.id.slice(0, 8)}</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Estado: {venta.estado}</p>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border-b border-slate-50 text-left">
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <User2 className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cliente</p>
                  <p className="text-sm font-black text-secondary">{venta.cliente_nombre}</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <CalendarClock className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                  <p className="text-sm font-black text-slate-700">{new Date(venta.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3 sm:col-span-2">
                <ReceiptText className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Totales</p>
                  <p className="text-sm font-black text-slate-700">
                    Productos: Bs. {Number(venta.total_productos).toFixed(2)} | Envío: Bs. {Number(venta.total_envio).toFixed(2)} | General: Bs. {Number(venta.total_general).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar bg-white text-left">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-[2px] text-emerald-500">Detalle de Productos</h4>
                <Badge className="bg-slate-100 text-slate-700 border-none">{venta.detalles.length} ítems</Badge>
              </div>
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                <DataTable columns={columns} data={venta.detalles || []} hideToolbar hidePagination />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
