import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Star, 
  Phone, 
  MapPin, 
  ShieldCheck,
  Hash,
  Copy,
  Check,
  Smartphone,
  ExternalLink
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { type User } from "../types"

interface UserDetailModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!user) return null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`${label} copiado`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNum}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw] h-[90vh] sm:h-auto sm:max-h-[85vh] bg-white rounded-3xl overflow-hidden border-none shadow-2xl p-0 flex flex-col">
        
        {/* HEADER: BLOQUE DE IDENTIDAD ALINEADO */}
        <div className="relative bg-primary/5 p-6 sm:p-10 border-b border-primary/10 flex-shrink-0">
          
          <DialogDescription className="sr-only">
            Vista detallada del perfil de {user.perfil?.nombre}, incluyendo información de contacto, fidelización y direcciones.
          </DialogDescription>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center border-4 border-primary/10 shadow-lg">
                <UserIcon className="h-12 w-12 text-primary" />
              </div>
              <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white shadow-sm ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </div>
            
            <div className="flex-grow w-full flex flex-col items-center sm:items-start">
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
                <div className="text-center sm:text-left">
                  <DialogTitle className="text-3xl font-black text-primary uppercase tracking-tighter leading-none">
                    {user.perfil?.nombre} {user.perfil?.apellido}
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-1.5 text-secondary self-center sm:self-start bg-secondary/10 px-3 py-1 rounded-lg border border-secondary/10">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{user.rol_nombre}</span>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start -space-y-0.5 w-full">
                <p className="text-sm text-secondary font-black italic opacity-80 px-1">
                  @{user.username}
                </p>
                
                <button 
                  onClick={() => copyToClipboard(user.email, "Correo")}
                  className="flex items-center gap-2 group cursor-pointer hover:bg-primary/5 px-1 py-1 rounded-md transition-colors w-fit"
                >
                  <Mail className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary shrink-0" />
                  <span className="text-xs font-bold text-primary/70">{user.email}</span>
                  {copiedId === user.email ? <Check className="w-3 h-3 text-emerald-500 animate-in zoom-in" /> : <Copy className="w-3 h-3 text-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>

                <button 
                  onClick={() => copyToClipboard(user.id, "ID")}
                  className="flex items-center gap-2 group cursor-pointer hover:bg-primary/5 px-1 py-1 rounded-md transition-colors w-fit"
                >
                  <Hash className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-slate-400">{user.id}</span>
                  {copiedId === user.id ? <Check className="w-3 h-3 text-emerald-500 animate-in zoom-in" /> : <Copy className="w-3 h-3 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 sm:p-10 pt-2 space-y-6 overflow-y-auto flex-grow bg-white custom-scrollbar">
          
          {/* FILA 1: DATOS FIJOS*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 border-b border-primary/5 pb-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[3px] text-primary flex items-center justify-center sm:justify-start gap-2">
                <Star className="w-4 h-4" /> Fidelización
              </h4>
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-4xl font-black text-secondary">{user.perfil?.puntos_fidelidad}</span>
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">puntos acumulados</span>
              </div>
            </div>

            <div className="space-y-1 sm:border-l sm:border-primary/5 sm:pl-10 text-center sm:text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[3px] text-primary flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="w-4 h-4" /> Nacimiento
              </h4>
              <p className="text-base font-black text-secondary">
                {user.perfil?.fecha_nacimiento || <span className="text-slate-300 italic font-bold">No registrada</span>}
              </p>
            </div>
          </div>

          {/* FILA 2: DATOS DINÁMICOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 items-start">
            
            {/* Comunicación */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[3px] text-primary flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Comunicación
              </h4>
              <div className="space-y-2">
                {user.telefonos.length > 0 ? (
                  user.telefonos.map((t, idx) => (
                    <div key={idx} className="group flex items-center justify-between p-3 rounded-2xl border border-primary/5 bg-slate-50/50 hover:bg-white hover:border-secondary/20 transition-all shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Phone className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] font-black text-secondary uppercase tracking-tighter opacity-70">{t.tipo}</span>
                          <span className="text-sm font-black text-secondary">{t.numero}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:bg-emerald-50" onClick={() => openWhatsApp(t.numero)}>
                          <ExternalLink className="h-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/20 hover:text-primary" onClick={() => copyToClipboard(t.numero, "Teléfono")}>
                          <Copy className="h-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] font-bold text-slate-300 italic py-1">Sin teléfonos registrados</p>
                )}
              </div>
            </div>

            {/* Direcciones */}
            <div className="space-y-3 sm:border-l sm:border-primary/5 sm:pl-10">
              <h4 className="text-[10px] font-black uppercase tracking-[3px] text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Direcciones
              </h4>
              <div className="space-y-2">
                {user.direcciones.length > 0 ? (
                  user.direcciones.map((d, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${d.es_principal ? 'border-secondary/20 bg-secondary/5 shadow-sm' : 'border-primary/5 bg-slate-50/30'}`}>
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${d.es_principal ? 'bg-secondary animate-pulse' : 'bg-primary/20'}`} />
                      <div className="flex-grow text-left">
                        <p className="text-xs font-black text-secondary leading-tight">{d.direccion_exacta}</p>
                        {d.es_principal && <span className="text-[8px] font-black uppercase text-secondary tracking-widest mt-1 block">Principal</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] font-bold text-slate-300 italic py-1">Sin direcciones configuradas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}