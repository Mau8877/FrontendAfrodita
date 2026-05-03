import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Loader2, MapPin, Package, User2 } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { useGetPedidoByIdQuery } from "../store";

interface PedidoDetailModalProps {
  pedidoId?: string;
  isOpen: boolean;
  onClose: () => void;
}

type ProductoPedido = {
  id_producto: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

const columns: ColumnDef<ProductoPedido>[] = [
  {
    accessorKey: "nombre",
    header: "Producto",
    cell: ({ row }) => (
      <div className="flex flex-col text-left">
        <span className="font-bold text-primary uppercase tracking-tight text-[12px]">
          {row.original.nombre}
        </span>
        <span className="text-[9px] font-mono text-slate-400">
          {row.original.id_producto}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "cantidad",
    header: () => <div className="text-center">Cantidad</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge className="bg-slate-100 text-slate-700 border-none font-black text-[10px] rounded-lg">
          {row.original.cantidad} UNID
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "precio_unitario",
    header: () => <div className="text-center">P. Unitario</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono font-bold text-slate-500 text-xs">
        Bs. {Number(row.original.precio_unitario).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "subtotal",
    header: () => <div className="text-center">Subtotal</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono font-black text-emerald-700 text-xs">
        Bs. {Number(row.original.subtotal).toFixed(2)}
      </div>
    ),
  },
];

export function PedidoDetailModal({ pedidoId, isOpen, onClose }: PedidoDetailModalProps) {
  const { data: apiResponse, isFetching, isError } = useGetPedidoByIdQuery(pedidoId || "", {
    skip: !isOpen || !pedidoId,
  });

  const pedido = apiResponse?.data;
  const productos = (pedido?.datos_json?.productos || []) as ProductoPedido[];
  const entrega = pedido?.datos_json?.entrega;
  const totales = pedido?.datos_json?.totales;
  const metodoEntrega = String(entrega?.metodo || "").toLowerCase() === "pickup"
    ? "Recojo en Tienda"
    : entrega?.metodo || "SIN METODO";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-[95vw] bg-white rounded-[2.5rem] overflow-hidden border-none shadow-2xl p-0 flex flex-col">
        <div className="sr-only">
          <DialogTitle>Detalle de Pedido</DialogTitle>
          <DialogDescription>Desglose de productos y datos logísticos del pedido.</DialogDescription>
        </div>

        {isFetching ? (
          <div className="h-[420px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 animate-pulse">Cargando pedido...</span>
          </div>
        ) : isError || !pedido ? (
          <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs italic">
            No se pudo obtener el detalle del pedido
          </div>
        ) : (
          <>
            <div className="p-6 border-b shrink-0 bg-primary/5 border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-primary leading-none">
                      Pedido {pedido.codigo}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                      Estado: {pedido.estado}
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px] font-black px-4 py-1.5 rounded-xl">
                  Total: Bs. {Number(totales?.total_general || 0).toFixed(2)}
                </Badge>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border-b border-slate-50 text-left">
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <User2 className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cliente</p>
                  <p className="text-sm font-black text-secondary">{pedido.cliente_nombre || "Cliente Invitado"}</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <CalendarClock className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                  <p className="text-sm font-black text-slate-700">{new Date(pedido.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3 sm:col-span-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entrega</p>
                  <p className="text-sm font-black text-slate-700">
                    {metodoEntrega} | Ref: {entrega?.referencia || "Sin referencia"} | Envío: Bs. {Number(entrega?.costo_envio || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar bg-white text-left">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-[2px] text-emerald-500">Productos del Pedido</h4>
                <span className="text-[10px] font-black text-slate-500 uppercase">{productos.length} ítems</span>
              </div>

              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={productos}
                  hideToolbar
                  hidePagination
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
