import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, ShieldAlert, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface GenericDeleteModalProps<T> {
  item: T | null
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: (params: { id: string; permanent: boolean }) => Promise<any>
  itemName: string
  itemType: string
  itemIdentifier?: string
  isSuperUser?: boolean
}

export function GenericDeleteModal<T extends { id: string }>({
  item,
  isOpen,
  onClose,
  onDelete,
  itemName,
  itemType,
  itemIdentifier,
  isSuperUser = true,
}: GenericDeleteModalProps<T>) {
  const [isPermanent, setIsPermanent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!item) return
    setLoading(true)
    try {
      await onDelete({ id: item.id, permanent: isPermanent })
      toast.success(isPermanent ? "Eliminado definitivamente" : "Enviado a la papelera")
      onClose()
      setTimeout(() => setIsPermanent(false), 200)
    } catch {
      toast.error("Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        
        <div className={`h-24 w-full flex items-center justify-center transition-all duration-500 ${
          isPermanent ? 'bg-rose-600' : 'bg-orange-500'
        }`}>
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-lg">
            {isPermanent 
              ? <ShieldAlert className="w-8 h-8 text-white animate-pulse" /> 
              : <AlertTriangle className="w-8 h-8 text-white" />
            }
          </div>
        </div>

        <div className="px-6 py-6 space-y-6 text-left">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900 text-center w-full">
              {isPermanent ? "Borrado Irreversible" : "Mover a la Papelera"}
            </DialogTitle>
            <DialogDescription asChild className="text-slate-500 font-bold text-[11px] leading-relaxed text-center w-full px-4">
              <div className="flex flex-col gap-2">
                {isPermanent ? (
                  <>
                    <span>Se eliminarán permanentemente todos los registros de {itemType} de la base de datos.</span>
                    <span className="text-[10px] text-rose-400 italic">Esta acción no se puede deshacer.</span>
                  </>
                ) : (
                  <span>
                    {itemType.charAt(0).toUpperCase() + itemType.slice(1)} será desactivad@. Podrás encontrarlo en el historial y restaurarlo después.
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Badge del Item */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-colors duration-500 ${
              isPermanent ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {itemName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-slate-800 truncate">{itemName}</span>
              {itemIdentifier && (
                <span className="text-[9px] font-bold text-slate-400 uppercase truncate">
                  {itemIdentifier}
                </span>
              )}
            </div>
          </div>

          {isSuperUser && (
            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${
              isPermanent ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="space-y-0.5">
                <Label className="text-[10px] font-black uppercase text-slate-700 tracking-tight block">
                  Protocolo de Eliminación
                </Label>
                <p className={`text-[8px] font-black uppercase italic transition-colors duration-500 ${
                  isPermanent ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  {isPermanent ? "Hard Delete: Sin retorno" : "Soft Delete: Seguro"}
                </p>
              </div>
              <Switch 
                checked={isPermanent} 
                onCheckedChange={setIsPermanent}
                className="data-[state=checked]:bg-rose-600"
              />
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-1">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-10 rounded-xl font-bold uppercase text-[9px] tracking-widest text-slate-400 hover:text-slate-600"
            >
              Cerrar
            </Button>
            <Button 
              type="button" 
              onClick={handleDelete}
              disabled={loading}
              className={`flex-[1.4] h-10 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-500 ${
                isPermanent 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              {loading ? "Procesando..." : isPermanent ? "Confirmar Eliminación" : "Confirmar Desactivación"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}