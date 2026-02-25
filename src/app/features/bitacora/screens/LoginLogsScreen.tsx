import { useState } from "react"
import { Lock, ShieldCheck, ShieldAlert, Globe, Copy, LogOut } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetLoginLogsQuery } from "../store/loginLogsApi" 
import { type LoginLog } from "../types" 
import { LoginLogsDetailModal } from '..'

// --- MAPEO DE CLASES ---
const STATUS_CLASSES = {
  success: "bg-emerald-100/70 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100/70 text-rose-700 border-rose-200",
  inSession: "text-zinc-600 animate-pulse",
  system: "text-amber-600",
  default: "text-slate-400"
};

export const LoginLogsScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [selectedSession, setSelectedSession] = useState<LoginLog | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : '-fecha_login'

  const { data: apiResponse, isFetching, refetch } = useGetLoginLogsQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const onDetail = (log: LoginLog) => {
    setSelectedSession(log);
    setIsDetailOpen(true);
  }

  const logs = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<LoginLog>[] = [
    {
        id: "id",
        header: "ID Sesión",
        enableSorting: false,
        accessorFn: (row) => row.id,
        cell: ({ row }) => {
            const fullId = row.original.id;
            const shortId = `${fullId.substring(0, 5)}...${fullId.substring(fullId.length - 5)}`;

            const copyToClipboard = () => {
                navigator.clipboard.writeText(fullId);
                toast.success("ID de sesión copiado");
            };

            return (
                <div className="flex items-center">
                    <button
                        onClick={copyToClipboard}
                        className="group flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-lg transition-all active:scale-95"
                    >
                        <span className="font-mono text-xs font-black text-slate-400 group-hover:text-secondary transition-colors">
                            {shortId}
                        </span>
                        <Copy className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                </div>
            );
        },
    },
    {
      id: "id_usuario__username", 
      header: "Usuario / Acceso",
      enableSorting: false,
      accessorFn: (row) => row.usuario_username,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary uppercase tracking-tighter text-xs">
            {row.original.usuario_username}
          </span>
          <span className="text-[10px] text-slate-400 font-mono leading-none">
            {row.original.usuario_email}
          </span>
          <span className="text-[9px] font-black text-secondary uppercase italic mt-0.5">
             {row.original.usuario_rol}
          </span>
        </div>
      ),
    },
    {
        accessorKey: "ip_address_login",
        header: "Direcciones IP",
        cell: ({ row }) => {
            const ipLogin = row.original.ip_address_login;
            const ipLogout = row.original.ip_address_logout;

            return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Globe className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-xs font-bold font-mono">{ipLogin || "127.0.0.1"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <LogOut className={`w-3.5 h-3.5 ${ipLogout === '0.0.0.0' ? 'text-amber-500' : 'text-rose-600'}`} />
                  <span className={`text-[10px] font-bold font-mono ${ipLogout === '0.0.0.0' ? STATUS_CLASSES.system : STATUS_CLASSES.default}`}>
                      {ipLogout === '0.0.0.0' ? "SYS (RE-INGRESO)" : (ipLogout || "—")}
                  </span>
                </div>
            </div>
            );
        }
    },
    {
      accessorKey: "exito",
      header: "Resultado",
      enableSorting: true,
      cell: ({ row }) => {
        const success = row.original.exito;
        const currentStyle = success ? STATUS_CLASSES.success : STATUS_CLASSES.failed;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentStyle}`}>
            {success ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
            {success ? "Exitoso" : "Fallido"}
          </span>
        )
      }
    },
    {
      accessorKey: "fecha_login",
      header: "Hora Login",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-xs">
            {format(new Date(row.original.fecha_login), "dd MMM, yyyy", { locale: es })}
          </span>
          <span className="text-[10px] text-emerald-600 font-black">
            {format(new Date(row.original.fecha_login), "HH:mm:ss 'hrs'")}
          </span>
        </div>
      )
    },
    {
      accessorKey: "fecha_logout",
      header: "Hora Logout",
      enableSorting: true,
      cell: ({ row }) => {
        const logout = row.original.fecha_logout;
        const success = row.original.exito;

        return (
          <div className="flex flex-col">
            {success ? (
              <>
                {logout ? (
                  <>
                    <span className="font-bold text-slate-700 text-xs">
                      {format(new Date(logout), "dd MMM, yyyy", { locale: es })}
                    </span>
                    <span className="text-[10px] text-rose-600 font-black">
                      {format(new Date(logout), "HH:mm:ss 'hrs'")}
                    </span>
                  </>
                ) : (
                  <span className={`text-[10px] font-black uppercase italic py-1 ${STATUS_CLASSES.inSession}`}>
                    (En Sesión...)
                  </span>
                )}
              </>
            ) : (
              <span className="text-[10px] text-slate-300 font-bold uppercase italic py-1">
                N/A
              </span>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Bitácora de Login" 
        icon={Lock} 
        breadcrumbs={[ { label: "Security" }, { label: "Login-Logs" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={logs}
          isFetching={isFetching}
          onRefresh={refetch}
          manualPagination={true}
          pageCount={totalPages}
          pageIndex={page}
          onPageChange={setPage}
          totalRecords={totalCount}
          globalFilter={searchValue} 
          onGlobalFilterChange={setSearchValue} 
          onSearchTrigger={handleSearchTrigger}
          sorting={sorting}
          onSortingChange={setSorting}
          onDetail={onDetail}
        />

        <LoginLogsDetailModal
          log={selectedSession}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </div>
  )
}