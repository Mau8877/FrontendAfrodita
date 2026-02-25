/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { History, Terminal } from "lucide-react"

interface AntesDespuesDataProps {
  isOpen: boolean
  onClose: () => void
  accion: any | null
}

const formatJsonWithColors = (json: any) => {
  if (!json) return <span className="text-slate-500 font-mono">// Sin datos registrados</span>;
  const jsonString = JSON.stringify(json, null, 2);
  
  return jsonString.split(/("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"[\s:]*|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g)
    .map((part, i) => {
      if (!part) return null;
      const trimmed = part.trim();
      
      if (/^"/.test(trimmed)) {
        // --- CAMBIO AQUÍ: Las llaves (keys) ahora son Sky-300 para máximo contraste ---
        if (/:$/.test(trimmed)) return <span key={i} className="text-sky-300 font-bold drop-shadow-[0_0_3px_rgba(125,211,252,0.3)]">{part}</span>;
        
        // Los valores de texto (strings) se mantienen en esmeralda
        return <span key={i} className="text-emerald-400">{part}</span>;
      }
      
      // Booleanos y Null en ámbar
      if (/^(true|false|null)$/.test(trimmed)) return <span key={i} className="text-amber-400 font-black">{part}</span>;
      
      // Números en un violeta brillante para diferenciar de las llaves
      if (/^-?\d+/.test(trimmed)) return <span key={i} className="text-purple-600 font-bold">{part}</span>;
      
      return <span key={i} className="text-slate-50">{part}</span>;
    });
};

const JsonBox = ({ title, data, variant }: { title: string, data: any, variant: 'before' | 'after' }) => (
  <div className="flex-1 flex flex-col min-w-0 border-2 rounded-2xl overflow-hidden h-full border-slate-800 shadow-2xl bg-slate-950">
    <div className={`px-4 py-3 border-b font-black text-[10px] uppercase tracking-[2px] flex items-center justify-between shrink-0 ${
      variant === 'before' ? 'bg-rose-950 text-rose-400 border-rose-900' : 'bg-emerald-950 text-emerald-400 border-emerald-900'
    }`}>
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4" />
        {title}
      </div>
      <div className="flex gap-2 opacity-80">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-[13px] leading-relaxed">
      <pre className="whitespace-pre-wrap break-all" style={{ textShadow: '0 0 2px rgba(255,255,255,0.1)' }}>
        {formatJsonWithColors(data)}
      </pre>
    </div>
  </div>
);

export function AntesDespuesData({ isOpen, onClose, accion }: AntesDespuesDataProps) {
  if (!accion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] h-[90vh] md:h-[85vh] rounded-3xl overflow-hidden border-2 border-slate-800 p-0 flex flex-col shadow-none [&>button>svg]:text-white [&>button]:opacity-100 bg-slate-900"
        style={{ 
          maxWidth: '950px', 
          zIndex: 9999
        }}
      >
        {/* HEADER */}
        <div className="p-6 pr-16 border-b shrink-0 border-slate-800 bg-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl text-white flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                <History className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex flex-col text-white min-w-0 pr-4">
                <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight break-words">
                  SISTEMA_AUDITORÍA :: <span className="text-purple-400">COMPARATIVA</span>
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-slate-400 truncate">
                        TABLA: {accion.tabla}
                    </span>
                </div>
              </div>
            </div>
            
            <Badge variant="outline" className="w-fit font-mono text-[11px] font-bold uppercase py-1.5 px-4 border-emerald-500/40 text-emerald-400 bg-emerald-950 shadow-sm">
              {accion.accion}
            </Badge>
          </div>
        </div>

        <DialogDescription className="sr-only">Visor de Auditoría Afrodita</DialogDescription>

        {/* CONTENIDO RESPONSIVE */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto md:overflow-hidden min-h-0 custom-scrollbar bg-slate-900">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch w-full h-full min-h-[500px] md:min-h-0">
            <JsonBox title="SNAPSHOT::BEFORE" data={accion.data_antes} variant="before" />
            <JsonBox title="SNAPSHOT::AFTER" data={accion.data_despues} variant="after" />
          </div>
        </div>

        <div className="px-6 md:px-8 py-4 border-t border-slate-800 shrink-0 flex justify-between items-center font-mono bg-slate-950">
          <p className="text-[9px] md:text-[10px] uppercase opacity-60 text-emerald-500 font-black [letter-spacing:2px]">
             &gt; AFRODITA_KERNEL_v1.0.0
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}