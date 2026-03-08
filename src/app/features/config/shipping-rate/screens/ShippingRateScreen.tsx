import { useState } from "react"
import { Map, Trash2, CheckCircle, MapPin, DollarSign, Ruler } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { 
  useGetShippingRatesQuery, 
  useDeleteShippingRateMutation 
} from "../store" 
import { type ShippingRate } from "../types" 
import { ShippingRateEditModal, ShippingRateCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const ShippingRateScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [rateToEdit, setRateToEdit] = useState<ShippingRate | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const [rateToDelete, setRateToDelete] = useState<ShippingRate | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [deleteShippingRate] = useDeleteShippingRateMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetShippingRatesQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const rates = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<ShippingRate>[] = [
    {
      accessorKey: "sucursal_nombre",
      header: "Sucursal Origen",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-bold text-primary uppercase tracking-tighter block text-[12px]">
            {row.original.sucursal_nombre}
          </span>
        </div>
      ),
    },
    {
      id: "rango",
      header: "Rango de Distancia",
      cell: ({ row }) => {
        const { distancia_min, distancia_max, es_local } = row.original;
        
        if (!es_local) return (
           <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
             Envío Nacional / A Coordinar
           </span>
        );

        return (
          <div className="flex items-center justify-center gap-2 mx-auto py-2">
            <Ruler className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-black text-slate-700 tracking-tighter">{Number(distancia_min).toFixed(1)}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">km</span>
              <span className="text-slate-300 mx-1">—</span>
              <span className="text-[14px] font-black text-slate-700 tracking-tighter">{Number(distancia_max).toFixed(1)}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">km</span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "precio",
      header: "Tarifa",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5 py-2 group cursor-default">
          <div className="p-1.5 rounded-full bg-slate-50 group-hover:bg-emerald-500 transition-colors duration-300">
            <DollarSign className="w-3 h-3 text-slate-400 group-hover:text-white" />
          </div>
          <span className="text-[16px] font-black text-emerald-700 tracking-tighter">
            {Number(row.original.precio).toFixed(2)}
            <span className="text-[9px] ml-1 uppercase font-bold text-emerald-500/60">Bs</span>
          </span>
        </div>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const isDeleted = !!row.original.deleted_at;

        return (
          <div className="flex justify-center">
            {isDeleted ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                <Trash2 className="w-3 h-3" />
                En Papelera
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                Activo
              </span>
            )}
          </div>
        )
      }
    }
  ]

  const onEdit = (rate: ShippingRate) => {
    setRateToEdit(rate);
    setIsEditOpen(true);
  }

  const onDelete = (rate: ShippingRate) => {
    setRateToDelete(rate);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Tarifas de Delivery" 
        icon={Map} 
        breadcrumbs={[ { label: "config" }, { label: "shipping-rate" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={rates}
          isFetching={isFetching}
          onRefresh={refetch}
          manualPagination={true}
          pageCount={totalPages}
          pageIndex={page}
          onPageChange={(newIndex) => setPage(newIndex)}
          totalRecords={totalCount}
          globalFilter={searchValue} 
          onGlobalFilterChange={setSearchValue} 
          onSearchTrigger={handleSearchTrigger}
          sorting={sorting}
          onSortingChange={setSorting}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      </div>

      <ShippingRateEditModal 
        rate={rateToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setRateToEdit(null);
        }} 
      />

      <ShippingRateCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <GenericDeleteModal
        item={rateToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRateToDelete(null);
        }}
        onDelete={(params) => deleteShippingRate(params).unwrap()}
        itemName={`Tarifa de ${rateToDelete?.distancia_max}km`}
        itemType="esta tarifa de envío"
        itemIdentifier="Configuración Logística"
        isSuperUser={true} 
      />
    </div>
  )
}