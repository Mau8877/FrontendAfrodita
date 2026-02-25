/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, 
  Monitor, 
  User as UserIcon,
  History,
  Loader2,
  Copy,
  Check,
  LogIn,
  LogOut
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { toast } from "sonner"
import { type LoginLog } from "../types"
import { useGetLoginLogByIdQuery } from "../store/loginLogsApi"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { AntesDespuesData } from "./AntesDespuesData"

// --- MAPEADO DE CLASES TAILWIND v4 PARA ACCIONES ---
const ACCION_CLASSES: Record<string, string> = {
  'CREATE': 'bg-emerald-100/70 text-emerald-700 border-emerald-200',
  'UPDATE': 'bg-amber-100/70 text-amber-700 border-amber-200',
  'SOFT_DELETE': 'bg-orange-100/70 text-orange-700 border-orange-200',
  'RESTORE': 'bg-sky-100/70 text-sky-700 border-sky-200',
  'DELETE': 'bg-rose-100/70 text-rose-700 border-rose-200',
  'DEFAULT': 'bg-slate-100/70 text-slate-700 border-slate-200'
};

interface LoginLogDetailModalProps {
  log: LoginLog | null
  isOpen: boolean
  onClose: () => void
}

const parseUserAgent = (ua: string) => {
  if (!ua) return "Desconocido";
  let browser = "Navegador Desconocido";
  let os = "SO Desconocido";

  if (ua.includes("Firefox/")) browser = "Mozilla Firefox";
  else if (ua.includes("Edg/")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome/")) browser = "Google Chrome";
  else if (ua.includes("Safari/")) browser = "Apple Safari";

  if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
  else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
  else if (ua.includes("Android")) os = "Dispositivo Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "Apple iOS";
  else if (ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux Desktop";

  return `${os} • ${browser}`;
};

const CopyActionCell = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("ID de acción copiado");
    setTimeout(() => setCopied(false), 2000);
  };
  const formatShortId = (str: string) => {
    if (!str) return "";
    return `${str.substring(0, 5)}...${str.substring(str.length - 5)}`;
  };
  return (
    <div className="flex items-center gap-1.5 group">
      <span className="font-mono font-bold text-slate-500 tracking-tighter" title={id}>
        {formatShortId(id)}
      </span>
      <button 
        onClick={handleCopy}
        className="p-1 hover:bg-white border border-transparent hover:border-slate-200 rounded text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ row }) => <CopyActionCell id={row.original.id} />,
  },
  {
    accessorKey: "tabla",
    header: "Módulo / Tabla",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-bold text-secondary uppercase tracking-tighter text-[11px]">
        {row.original.tabla}
      </span>
    ),
  },
  {
    accessorKey: "accion",
    enableSorting: false,
    header: () => <div className="text-center">Acción</div>,
    cell: ({ row }) => {
      const accion = String(row.original.accion || "").trim().toUpperCase();
      const tailwindClass = ACCION_CLASSES[accion] || ACCION_CLASSES.DEFAULT;

      return (
        <div className="flex justify-center">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border shadow-sm ${tailwindClass}`}>
            {accion}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "fecha_hora",
    enableSorting: false,
    header: () => <div className="text-center">Fecha y Hora</div>, // Cabecera centrada
    cell: ({ row }) => (
      <div className="flex flex-col items-center justify-center text-center"> 
        <span className=" text-slate-800 text-[11px] font-semibold">
          {format(new Date(row.original.fecha_hora), "dd MMM, yyyy", { locale: es })}
        </span>
        <span className="text-[9px] text-emerald-600 font-black">
          {format(new Date(row.original.fecha_hora), "HH:mm:ss")}
        </span>
      </div>
    ),
  },
];

export function LoginLogsDetailModal({ log, isOpen, onClose }: LoginLogDetailModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<any | null>(null);
  const [isAntesDespuesOpen, setIsAntesDespuesOpen] = useState(false);

  const { data: apiResponse, isFetching } = useGetLoginLogByIdQuery(log?.id || "", {
    skip: !isOpen || !log?.id,
  });

  const fullLog = apiResponse?.data || log;
  if (!fullLog) return null;

  const handleCopy = (text: string, id: string, message: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(message);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetail = (accion: any) => {
    setSelectedAction(accion);
    setIsAntesDespuesOpen(true);
  };

  const loginTime = fullLog.fecha_login ? format(new Date(fullLog.fecha_login), "HH:mm:ss") : "--:--:--";
  const loginDate = fullLog.fecha_login ? format(new Date(fullLog.fecha_login), "dd MMM yyyy", { locale: es }) : "—";
  const logoutTime = fullLog.fecha_logout 
    ? format(new Date(fullLog.fecha_logout), "HH:mm:ss") 
    : (fullLog.exito ? "En Sesión..." : "—");
  const logoutDate = fullLog.fecha_logout 
    ? format(new Date(fullLog.fecha_logout), "dd MMM yyyy", { locale: es }) 
    : "";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl w-[95vw] h-[90vh] md:h-auto md:max-h-[85vh] bg-white rounded-3xl overflow-hidden border-none shadow-2xl p-0 flex flex-col [&>button>svg]:text-white">
          
          <div className={`p-4 md:p-6 border-b shrink-0 transition-colors duration-500 ${fullLog.exito ? 'bg-primary/5 border-primary/10' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <DialogTitle className="text-lg md:text-xl font-black uppercase tracking-tighter text-primary leading-none flex items-center gap-2 truncate">
                    Detalles de la sesión
                    <button onClick={() => handleCopy(fullLog.id, 'main', 'ID de sesión copiado')} className="bg-white border border-primary/20 p-1 rounded-md hover:bg-primary/5 transition-all shrink-0">
                      {copiedId === 'main' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary/40" />}
                    </button>
                  </DialogTitle>
                  <span className="text-[9px] md:text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter opacity-70 truncate">ID: {fullLog.id}</span>
                </div>
              </div>
              <Badge variant="outline" className={`w-fit text-[9px] md:text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${fullLog.exito ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                {fullLog.exito ? "Conexión Establecida" : "Acceso Fallido"}
              </Badge>
            </div>
          </div>

          <div className="px-4 md:px-6 bg-white shrink-0 py-2">
            <div className="flex flex-col md:flex-row w-full items-stretch bg-slate-50/50 rounded-2xl border border-primary/5 overflow-hidden">
              <div className="flex items-center gap-4 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-200/80 min-w-0">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white border border-primary/10 flex items-center justify-center shadow-sm shrink-0">
                  <UserIcon className="w-6 h-6 md:w-7 md:h-7 text-primary/40" />
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <h3 className="text-sm font-black text-primary uppercase truncate leading-none mb-1.5">
                    {fullLog.usuario_username}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 truncate">{fullLog.usuario_email}</span>
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest italic">{fullLog.usuario_rol}</span>
                </div>
              </div>

              <div className="flex flex-1 divide-x divide-slate-200/80">
                <div className="flex-1 flex flex-col items-center justify-center p-3 text-center min-w-0">
                  <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-secondary uppercase tracking-widest mb-1 md:mb-1.5">
                    <LogIn className="w-3 h-3 text-emerald-500" /> IP Login
                  </div>
                  <span className="text-[11px] md:text-xs font-mono font-bold text-slate-700 leading-none mb-1 truncate w-full px-1">{fullLog.ip_address_login || '127.0.0.1'}</span>
                  <div className="flex flex-col items-center leading-none gap-0.5">
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{loginDate}</span>
                    <span className="text-[10px] md:text-[11px] font-black text-emerald-600 tracking-tighter">{loginTime}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-3 text-center min-w-0">
                  <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-secondary uppercase tracking-widest mb-1 md:mb-1.5">
                      IP Logout <LogOut className="w-3 h-3 text-rose-500" />
                  </div>
                  <span className={`text-[11px] md:text-xs font-mono font-bold leading-none mb-1 truncate w-full px-1 ${fullLog.ip_address_logout === '0.0.0.0' ? 'text-amber-500' : 'text-slate-700'}`}>
                     {fullLog.ip_address_logout === '0.0.0.0' ? 'SISTEMA' : (fullLog.ip_address_logout || '—')} 
                  </span>
                  <div className="flex flex-col items-center leading-none gap-0.5">
                    {logoutDate && <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{logoutDate}</span>}
                    <span className={`text-[10px] md:text-[11px] font-black tracking-tighter ${
                      fullLog.fecha_logout 
                        ? 'text-rose-600' 
                        : (fullLog.exito ? '!text-zinc-600 animate-pulse mt-1' : '!text-slate-400 mt-1')
                    }`}>
                      {logoutTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 pt-2 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar flex-grow">
            <DialogDescription className="sr-only">Historial de acciones técnicas.</DialogDescription>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[3px] text-primary flex items-center gap-2">
                <History className="w-4 h-4" /> Actividad en esta sesión
              </h4>
              {isFetching ? (
                <div className="py-10 flex flex-col items-center gap-2 opacity-50">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Sincronizando...</span>
                </div>
              ) : fullLog.acciones && fullLog.acciones.length > 0 ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                  <DataTable 
                    columns={columns} 
                    data={fullLog.acciones} 
                    hideToolbar={true}
                    hidePagination={true}
                    onDetail={handleViewDetail}
                  />
                </div>
              ) : (
                <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-[10px] font-bold text-slate-300 uppercase italic">
                  Sin actividad registrada en esta sesión
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-900 rounded-2xl shadow-inner border-l-4 border-emerald-500/30">
              <div className="flex items-center gap-2 mb-1.5">
                <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Información del Dispositivo</span>
              </div>
              <p className="text-xs font-mono font-bold text-emerald-400 tracking-tight">
                {fullLog.user_agent ? parseUserAgent(fullLog.user_agent) : "Dispositivo desconocido"}
              </p>
              <p className="text-[9px] font-mono text-emerald-500 break-all leading-tight mt-1">
                UA: {fullLog.user_agent}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AntesDespuesData 
        isOpen={isAntesDespuesOpen}
        onClose={() => setIsAntesDespuesOpen(false)}
        accion={selectedAction}
      />
    </>
  )
}