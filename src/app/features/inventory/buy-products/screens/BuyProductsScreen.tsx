/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Receipt, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetReplenishmentsQuery } from "../store/replenishmentApi" 
import { type Replenishment } from "../types" 
import { ReplenishmentDetailModal, ReplenishmentCreateModal, AnnulPurchaseModal } from "../components"

export const BuyProductsScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 
  
  const [selectedPurchase, setSelectedPurchase] = useState<Replenishment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAnnulOpen, setIsAnnulOpen] = useState(false)

  // Mapeo de ordering para que coincida con los campos del ViewSet (nombre_proveedor y unidades)
  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : '-fecha_compra'

  const { data: apiResponse, isFetching, refetch } = useGetReplenishmentsQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const purchases = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<Replenishment>[] = [
    {
        id: "id", 
        header: "ID Compra",
        enableSorting: false,
        cell: ({ row }) => {
            const fullId = row.original.id;
            const shortId = `${fullId.substring(0, 5)}...${fullId.substring(fullId.length - 5)}`;
            return (
                <button
                    onClick={() => { navigator.clipboard.writeText(fullId); toast.success("ID copiado"); }}
                    className="group flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-lg transition-all"
                >
                    <span className="font-mono text-[11px] font-black text-slate-400 group-hover:text-secondary transition-colors">
                        {shortId}
                    </span>
                    <Copy className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
            );
        },
    },
    {
      accessorKey: "nombre_proveedor",
      id: "nombre_proveedor",
      header: "Proveedor",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-bold text-primary uppercase tracking-tighter text-xs">
          {row.original.nombre_proveedor}
        </span>
      ),
    },
    {
      accessorKey: "fecha_compra",
      id: "fecha_compra",
      header: "Fecha de Registro",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-xs">
            {format(new Date(row.original.fecha_compra), "dd MMM, yyyy", { locale: es })}
          </span>
          <span className="text-[10px] text-primary font-black uppercase">
            {format(new Date(row.original.fecha_compra), "HH:mm 'hrs'")}
          </span>
        </div>
      )
    },
    {
      accessorKey: "unidades",
      id: "unidades",
      header: "Cant. Unidades",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
          {row.original.unidades} PCS
        </span>
      )
    },
    {
      accessorKey: "total",
      id: "total",
      header: "Total Inversión",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm font-black text-secondary">
          Bs. {parseFloat(row.original.total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      accessorKey: "estado",
      id: "estado",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => {
        const isAnnulled = row.original.estado === 'ANULADO';

        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
            isAnnulled 
            ? 'bg-rose-100/50 text-rose-700 border-rose-200' 
            : 'bg-emerald-100/50 text-emerald-700 border-emerald-200'
          }`}>
            {isAnnulled ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {row.original.estado}
          </span>
        )
      }
    }
  ]

  const onDetail = (purchase: Replenishment) => {
    setSelectedPurchase(purchase);
    setIsDetailOpen(true);
  }

  const onAnnul = (purchase: Replenishment) => {
    if (purchase.estado === 'ANULADO') return;
    setSelectedPurchase(purchase);
    setIsAnnulOpen(true);
  }

  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Reposición de Stock" 
        icon={Receipt} 
        breadcrumbs={[ { label: "Inventory" }, { label: "Buy-Products" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={purchases}
          isFetching={isFetching}
          onRefresh={refetch}
          manualPagination 
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
          onAnnul={onAnnul}
          onAdd={onAdd}
        />
      </div>

      <ReplenishmentDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => {
            setIsDetailOpen(false);
            setSelectedPurchase(null);
        }} 
        purchaseId={selectedPurchase?.id} 
      />

      <ReplenishmentCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <AnnulPurchaseModal
        purchase={selectedPurchase}
        isOpen={isAnnulOpen}
        onClose={() => {
          setIsAnnulOpen(false);
          setSelectedPurchase(null);
        }}
      />
    </div>
  )
}