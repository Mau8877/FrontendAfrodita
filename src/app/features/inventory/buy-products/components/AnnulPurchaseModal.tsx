/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OctagonX, AlertTriangle, ArrowLeftRight, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { useAnnulReplenishmentMutation } from "../store/replenishmentApi"
import { type Replenishment } from "../types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Props {
  purchase: Replenishment | null
  isOpen: boolean
  onClose: () => void
}

export function AnnulPurchaseModal({ purchase, isOpen, onClose }: Props) {
  const [annulPurchase, { isLoading }] = useAnnulReplenishmentMutation()

  const handleAnnul = async () => {
    if (!purchase) return;

    try {
        await annulPurchase(purchase.id).unwrap()
        
        toast.success("¡Operación anulada con éxito!", {
            description: "El stock ha sido revertido y los lotes eliminados.",
            unstyled: true,
            classNames: {
            toast: 'bg-white border border-emerald-200 p-4 rounded-2xl flex flex-col gap-1 w-full shadow-lg',
            title: 'text-emerald-900 font-black uppercase text-xs tracking-tighter',
            description: 'text-slate-950! text-[10px] font-bold leading-tight opacity-100',
            },
        })
        
        onClose()
    } catch (error: any) {
        const message = error?.data?.message || "No se pudo anular la compra."
        
        toast.error("Error de integridad:", {
            description: message,
            unstyled: true,
            classNames: {
            toast: 'bg-white border border-rose-200 p-4 rounded-2xl flex flex-col gap-1 w-full shadow-lg',
            title: 'text-rose-900 font-black uppercase text-xs tracking-tighter',
            description: 'text-slate-950! text-[10px] font-bold leading-tight opacity-100',
            },
        })
    }
  }

  if (!purchase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        
        {/* Cabecera de Advertencia */}
        <DialogHeader className="p-8 bg-rose-500/5 border-b border-rose-500/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
              <OctagonX className="text-rose-600 w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-rose-950 uppercase tracking-tighter">
                Anular Reposición
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-rose-600/60 uppercase tracking-widest mt-1">
                Esta acción es irreversible y afectará el inventario.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {/* Resumen de lo que se va a anular */}
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Proveedor</p>
                  <p className="text-sm font-bold text-primary">{purchase.nombre_proveedor}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha Original</p>
                  <p className="text-xs font-bold text-slate-600">
                    {format(new Date(purchase.fecha_compra), "dd/MM/yyyy", { locale: es })}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-secondary">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Impacto Stock</p>
                  <p className="text-xs font-black text-secondary">-{purchase.unidades} PCS</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-rose-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Retorno Caja</p>
                  <p className="text-xs font-black text-rose-600">Bs. {Number(purchase.total).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de Validación */}
          <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[11px] leading-relaxed font-medium text-amber-800">
              Solo se puede anular si <strong>ninguno</strong> de los productos ingresados en esta compra ha sido vendido. El sistema verificará la integridad de los lotes antes de proceder.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-row gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose} 
            className="flex-1 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200"
          >
            Volver
          </Button>
          <Button 
            type="button" 
            disabled={isLoading}
            onClick={handleAnnul}
            className="flex-[1.5] h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-200 active:scale-95 transition-all"
          >
            {isLoading ? "Verificando..." : "Confirmar Anulación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}