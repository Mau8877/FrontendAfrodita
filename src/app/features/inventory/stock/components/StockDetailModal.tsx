/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Box, Calendar, Layers,
  Copy, Check, TrendingUp, Tag, CalendarClock, Loader2,
  AlertTriangle
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useGetStockByIdQuery } from "../store/stockApi"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "nro_lote",
    header: "Lote",
    enableSorting: false,
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
    accessorKey: "cantidad_actual",
    enableSorting: false,
    header: () => <div className="text-center">Existencia</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge className="bg-emerald-100/50 text-emerald-700 border-none font-black text-[10px] rounded-lg">
          {row.original.cantidad_actual} UNITS
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "costo_unitario",
    enableSorting: false,
    header: () => <div className="text-center">Costo de Entrada</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono font-bold text-slate-500 text-xs">
        Bs. {Number(row.original.costo_unitario).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "ano_vencimiento",
    enableSorting: false,
    header: () => <div className="text-center">Vencimiento</div>,
    cell: ({ row }) => {
      const currentYear = new Date().getFullYear();
      const isExpired = row.original.ano_vencimiento <= currentYear;
      
      return (
        <div className="flex justify-center">
          <Badge className={`border-none font-black text-[10px] px-3 ${
            isExpired 
              ? 'bg-rose-100 text-rose-600' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            <Calendar className="w-3 h-3 mr-1" />
            {row.original.ano_vencimiento}
          </Badge>
        </div>
      );
    },
  },
];

interface Props {
  productId: string | undefined
  isOpen: boolean
  onClose: () => void
}

export function StockDetailModal({ productId, isOpen, onClose }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: apiResponse, isFetching, isError } = useGetStockByIdQuery(productId || "", {
    skip: !isOpen || !productId,
  });

  const product = apiResponse?.data;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("ID copiado al portapapeles");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw] bg-white rounded-[2.5rem] overflow-hidden border-none shadow-2xl p-0 flex flex-col [&>button>svg]:text-primary">
        
        <div className="sr-only">
          <DialogTitle>Auditoría de Lotes: {product?.nombre}</DialogTitle>
          <DialogDescription>Visualización de existencias reales por lotes y vencimientos.</DialogDescription>
        </div>

        {isFetching ? (
          <div className="h-[450px] flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-10 h-10 animate-spin text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 animate-pulse">Analizando Lotes Activos...</span>
          </div>
        ) : isError || !product ? (
          <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs italic">
            No se pudo obtener el desglose del producto
          </div>
        ) : (
          <>
            {/* CABECERA VISUAL */}
            <div className="p-6 border-b shrink-0 bg-secondary/5 border-secondary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/20 shrink-0">
                    <Box className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0 pr-4">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-secondary leading-none flex items-center gap-2 truncate">
                      {product.nombre}
                    </h2>
                    
                    <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">SKU: {product.sku || 'SIN SKU'}</span>
                        </div>
                        <div className="flex items-center gap-1 group">
                          <span className="text-[9px] font-mono text-slate-300 uppercase tracking-tighter">
                            ID PRODUCTO: {product.id}
                          </span>
                          <button 
                            onClick={() => handleCopy(product.id, 'prod-id')} 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedId === 'prod-id' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5 text-slate-300" />}
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
                {product.total_stock <= 5 && (
                  <Badge className="bg-rose-50 text-rose-600 border-rose-100 text-[10px] font-black uppercase px-4 py-1.5 rounded-xl animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Stock Crítico
                  </Badge>
                )}
              </div>
            </div>

            {/* RESUMEN RÁPIDO */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border-b border-slate-50 text-left">
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-secondary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Existencia Total</p>
                  <p className="text-sm font-black text-secondary">{product.total_stock} Unidades</p>
                </div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-amber-500">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Lotes con Stock</p>
                  <p className="text-sm font-black text-slate-700">{product.lotes_activos?.length || 0} Activos</p>
                </div>
              </div>
            </div>

            {/* TABLA DE LOTES */}
            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar bg-white text-left">
              <div className="flex items-center gap-2 mb-4">
                 <Layers className="w-4 h-4 text-emerald-600" />
                 <h4 className="text-[10px] font-black uppercase tracking-[2px] text-emerald-500">Desglose de Lotes en Estantería</h4>
              </div>
              
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                <DataTable 
                  columns={columns} 
                  data={product.lotes_activos || []} 
                  hideToolbar 
                  hidePagination 
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 bg-slate-50 flex justify-between items-center px-8 border-t border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Afrodita Inventory System v3</span>
              <span className="text-[9px] font-mono text-slate-300">REF: {product.id.split('-')[0]}</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}