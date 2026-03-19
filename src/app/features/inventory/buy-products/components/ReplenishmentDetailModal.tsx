/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  PackageSearch, Truck, Calendar, Layers,
  Copy, Check, TrendingUp, Tag, CalendarClock, Loader2
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { toast } from "sonner"
import { useGetReplenishmentByIdQuery } from "../store/replenishmentApi"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "nro_lote",
    header: "Lote",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Layers className="w-4 h-4 text-secondary/90" />
        <span className="font-mono font-bold text-secondary tracking-tighter text-[12px]">
          {row.original.nro_lote}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nombre_producto",
    header: "Producto",
    cell: ({ row }) => (
      <span className="font-bold text-slate-700 uppercase tracking-tighter text-[11px]">
        {row.original.nombre_producto}
      </span>
    ),
  },
  {
    accessorKey: "cantidad",
    header: () => <div className="text-center">Cant.</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge className="bg-secondary/10 text-secondary border-none font-black text-[10px]">
          {row.original.cantidad} UNITS
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "precio_costo",
    header: () => <div className="text-center">Costo Unit.</div>,
    cell: ({ row }) => (
      <Badge className="bg-emerald-100/50 border-none text-center font-mono font-bold text-emerald-600 text-xs">
        Bs. {Number(row.original.precio_costo).toFixed(2)}
      </Badge>
    ),
  },
];

interface Props {
  purchaseId: string | undefined
  isOpen: boolean
  onClose: () => void
}

export function ReplenishmentDetailModal({ purchaseId, isOpen, onClose }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: apiResponse, isFetching, isError } = useGetReplenishmentByIdQuery(purchaseId || "", {
    skip: !isOpen || !purchaseId,
  });

  const purchase = apiResponse?.data;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* CAMBIO CRÍTICO 1: Fijamos la altura del modal estrictamente a h-[90vh] md:h-[85vh] */}
      <DialogContent className="sm:max-w-3xl w-[95vw] h-[90vh] md:h-[85vh] bg-white rounded-[2.5rem] overflow-hidden border-none shadow-2xl p-0 flex flex-col [&>button>svg]:text-primary">
        
        {/* TÍTULO Y DESCRIPCIÓN PARA ACCESIBILIDAD */}
        <div className="sr-only">
          <DialogTitle>Detalle de Reposición {purchaseId}</DialogTitle>
          <DialogDescription>Desglose técnico de la entrada de mercadería y lotes generados.</DialogDescription>
        </div>

        {/* CAMBIO 2: flex-1 para que el loader o el error se centren en el espacio del modal */}
        {isFetching ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-10 h-10 animate-spin text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 animate-pulse">Sincronizando Auditoría...</span>
          </div>
        ) : isError || !purchase ? (
          <div className="flex-1 flex items-center justify-center p-20 text-center text-slate-400 font-bold uppercase text-xs italic">
            No se pudo cargar la información de la compra
          </div>
        ) : (
          <>
            {/* CAMBIO 3: CABECERA VISUAL (Agregado shrink-0 para que no se aplaste) */}
            <div className="p-4 md:p-6 border-b shrink-0 bg-primary/5 border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                    <PackageSearch className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex flex-col min-w-0 pr-4">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-primary leading-none flex items-center gap-2 truncate">
                      Auditoría de Reposición
                    </h2>
                    
                    <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-wider">{purchase.nombre_proveedor}</span>
                        </div>
                        <div className="flex items-center gap-1 group">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter opacity-70">
                            ID: {purchase.id}
                          </span>
                          <button 
                            onClick={() => handleCopy(purchase.id, 'sub-id')} 
                            className="bg-white border border-slate-200 p-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copiedId === 'sub-id' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5 text-slate-300" />}
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
                <Badge className={`w-fit text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border ${purchase.estado === 'COMPLETADO' ? 'bg-emerald-500 text-white border-none' : 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm'}`}>
                  {purchase.estado}
                </Badge>
              </div>
            </div>

            {/* CAMBIO 4: DASHBOARDS DE RESUMEN (Agregado shrink-0) */}
            <div className="px-4 md:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border-b border-slate-50 text-left shrink-0">
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Inversión</p>
                  <p className="text-sm font-black text-primary">Bs. {Number(purchase.total).toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-secondary">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Stock</p>
                  <p className="text-sm font-black text-secondary">{purchase.unidades} PCS</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-amber-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Fecha</p>
                  <p className="text-sm font-black text-slate-700">{format(new Date(purchase.fecha_compra), "dd MMM, yyyy", { locale: es })}</p>
                </div>
              </div>
            </div>

            {/* CAMBIO 5: TABLA DE DETALLES - LA JAULA DE HIERRO
                flex-1 y min-h-0 le dicen a la tabla "NO IMPORTA CUÁNTOS LOTES TENGAS, 
                NO PUEDES ESTIRAR EL MODAL. ACTIVA TU SCROLL INTERNO." 
            */}
            <div className="flex-1 min-h-0 flex flex-col bg-white text-left p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                 <CalendarClock className="w-4 h-4 text-emerald-600" />
                 <h4 className="text-[10px] font-black uppercase tracking-[2px] text-emerald-500">Desglose de Lotes Generados</h4>
              </div>
              
              {/* Aquí ocurre la magia del scroll interno */}
              <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl shadow-sm bg-white">
                <DataTable 
                  columns={columns} 
                  data={purchase.detalles || []} 
                  hideToolbar 
                  hidePagination 
                />
              </div>
            </div>

            {/* CAMBIO 6: FOOTER DE AUDITORÍA (Agregado shrink-0) */}
            <div className="p-4 md:px-8 bg-primary/35 flex justify-between items-center border-t border-white/5 shrink-0">
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Registrado por</span>
                <span className="text-xs font-bold text-secondary uppercase tracking-tight leading-none">
                  {purchase.nombre_usuario || "System Admin"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[9px] font-mono text-slate-700 font-bold uppercase tracking-tighter">REF: {purchase.id.split('-')[0]}</span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}