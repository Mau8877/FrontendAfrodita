/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { History, Copy, Database } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetActionLogsQuery } from "../store" 
import { type BitacoraAccion } from "../types" 
import { AntesDespuesData } from "../components/AntesDespuesData"

// --- MAPEADO DE CLASES COMPLETAS (TAILWIND PURISTA) ---
// Escribir la clase entera garantiza que el compilador la detecte
const ACCION_CLASSES: Record<string, string> = {
  'CREATE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'UPDATE': 'bg-amber-100 text-amber-700 border-amber-200',
  'SOFT_DELETE': 'bg-orange-100 text-orange-700 border-orange-200',
  'RESTORE': 'bg-sky-100 text-sky-700 border-sky-200',
  'DELETE': 'bg-rose-100 text-rose-700 border-rose-200',
  'DEFAULT': 'bg-slate-100 text-slate-700 border-slate-200'
};

export const BitacoraLogsScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 
  const [selectedAction, setSelectedAction] = useState<BitacoraAccion | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const ordering = sorting.length ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '-fecha_hora'

  const { data: apiResponse, isFetching, refetch } = useGetActionLogsQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const onDetail = (accion: BitacoraAccion) => {
    setSelectedAction(accion);
    setIsDetailOpen(true);
  }

  const actions = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<BitacoraAccion>[] = [
    {
        id: "id",
        header: "ID Acción",
        enableSorting: false,
        cell: ({ row }) => {
            const fullId = row.original.id;
            const shortId = `${fullId.substring(0, 5)}...${fullId.substring(fullId.length - 5)}`;
            return (
                <button
                    onClick={() => { navigator.clipboard.writeText(fullId); toast.success("ID copiado"); }}
                    className="group flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-lg transition-all"
                >
                    <span className="font-mono text-xs font-black text-slate-400 group-hover:text-secondary transition-colors">
                        {shortId}
                    </span>
                    <Copy className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
            );
        },
    },
    {
      id: "usuario", 
      header: "Usuario / Autor",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary uppercase tracking-tighter text-xs">{row.original.usuario_username}</span>
          <span className="text-[10px] text-slate-400 font-mono leading-none">{row.original.usuario_email}</span>
          <span className="text-[9px] font-black text-secondary uppercase italic mt-0.5">{row.original.usuario_rol}</span>
        </div>
      ),
    },
    {
        accessorKey: "ip_address",
        header: "IP",
        enableSorting: false,
        cell: ({ row }) => <span className="text-xs font-bold font-mono text-slate-600">{row.original.ip_address || "127.0.0.1"}</span>
    },
    {
      accessorKey: "tabla",
      header: "Módulo / Tabla",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-[180px]">
          <Database className="w-3.5 h-3.5 text-secondary/50 shrink-0" />
          <span className="font-black text-secondary uppercase tracking-tighter text-[11px] truncate" title={row.original.tabla}>
            {row.original.tabla}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "accion",
      header: "Operación",
      cell: ({ row }) => {
        const accion = row.original.accion;
        // Obtenemos la clase entera del mapeo
        const tailwindClasses = ACCION_CLASSES[accion] || ACCION_CLASSES.DEFAULT;

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${tailwindClasses}`}>
            {accion}
          </span>
        )
      }
    },
    {
      accessorKey: "fecha_hora",
      header: "Fecha y Hora",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-xs">{format(new Date(row.original.fecha_hora), "dd MMM, yyyy", { locale: es })}</span>
          <span className="text-[10px] text-primary font-black">{format(new Date(row.original.fecha_hora), "HH:mm:ss 'hrs'")}</span>
        </div>
      )
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Bitácora de Acciones" icon={History} breadcrumbs={[ { label: "Security" }, { label: "Action-Logs" } ]} />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={actions}
          isFetching={isFetching}
          onRefresh={refetch}
          manualPagination pageCount={totalPages} pageIndex={page}
          onPageChange={setPage}
          totalRecords={totalCount}
          globalFilter={searchValue} 
          onGlobalFilterChange={setSearchValue} 
          onSearchTrigger={handleSearchTrigger}
          sorting={sorting}
          onSortingChange={setSorting}
          onDetail={onDetail}
        />
        <AntesDespuesData isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} accion={selectedAction} />
      </div>
    </div>
  )
}