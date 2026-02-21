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
import { type User } from "../types"
import { useDeleteUserMutation } from "../store/usersApi"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface UserDeleteModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDeleteModal({ user, isOpen, onClose }: UserDeleteModalProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation()
  const [isPermanent, setIsPermanent] = useState(false)

  // En un entorno real, esto vendría de tu auth selector
  const isSuperUser = true; 

  const handleDelete = async () => {
    if (!user) return
    try {
      await deleteUser({ 
        id: user.id, 
        permanent: isPermanent 
      }).unwrap()
      
      toast.success(isPermanent ? "Usuario borrado definitivamente" : "Usuario enviado a la papelera")
      onClose()
      setTimeout(() => setIsPermanent(false), 200)
    } catch {
      toast.error("Error al procesar la solicitud de baja")
    }
  }

  const displayName = user?.perfil?.nombre && user?.perfil?.apellido 
    ? `${user.perfil.nombre} ${user.perfil.apellido}`
    : user?.username;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        
        {/* Cabecera con Icono Dinámico */}
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

        <div className="px-6 py-6 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900 text-center w-full">
              {isPermanent ? "Borrado Irreversible" : "Mover a la Papelera"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-bold text-[11px] leading-relaxed text-center w-full px-2">
              {isPermanent 
                ? "Se eliminarán permanentemente todos los registros y relaciones de este usuario de la base de datos."
                : "El usuario será desactivado. Podrás encontrarlo en la tabla y restaurarlo en la acción de edición."}
            </DialogDescription>
          </DialogHeader>

          {/* Información del Usuario - Estilo Badge */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-colors duration-500 ${
              isPermanent ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {displayName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-slate-800 truncate">{displayName}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase truncate">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Selector de Protocolo Dinámico */}
          {isSuperUser && (
            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${
              isPermanent ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="space-y-0.5">
                <Label className="text-[10px] font-black uppercase text-slate-700 tracking-tight block">
                  {isPermanent ? "Hard Delete Permanent" : "Soft Delete Seguro"}
                </Label>
                <p className={`text-[8px] font-black uppercase italic transition-colors duration-500 ${
                  isPermanent ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  {isPermanent ? "¡Atención! Sin retorno" : "Desactivación segura"}
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
              disabled={isLoading}
              className={`flex-[1.4] h-10 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-500 ${
                isPermanent 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              {isLoading ? "Enviando..." : isPermanent ? "Confirmar Eliminación" : "Confirmar Desactivación"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}