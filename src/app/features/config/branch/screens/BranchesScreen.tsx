import { useState } from "react"
import { Store, Trash2, CheckCircle, MapPin, ExternalLink, Globe } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { 
  useGetBranchesQuery, 
  useDeleteBranchMutation 
} from "../store/branchesApi" 
import { type Branch } from "../types" 
import { BranchEditModal, BranchCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const BranchesScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [deleteBranch] = useDeleteBranchMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetBranchesQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const branches = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre Sucursal",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 shrink-0">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-bold text-primary uppercase tracking-tighter block">
            {row.original.nombre}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "direccion_fisica",
      header: "Dirección",
      enableSorting: true,
      cell: ({ row }) => (
        /* CAMBIO: Centrado mx-auto y efecto hover:line-clamp-none igual a Marcas */
        <div className="max-w-[300px] py-2 mx-auto text-center group"> 
          <p className="text-slate-600 text-[11px] font-medium leading-relaxed break-words whitespace-pre-wrap line-clamp-2 hover:line-clamp-none transition-all duration-300">
            {row.original.direccion_fisica}
          </p>
        </div>
      ),
    },
    {
      id: "coordenadas",
      header: "Ubicación GPS",
      cell: ({ row }) => {
        const { latitud, longitud } = row.original;
        const hasCoords = latitud && longitud;

        if (!hasCoords) return <span className="text-[9px] font-bold text-slate-300 italic uppercase">Sin GPS</span>;

        return (
          /* CAMBIO: justify-center para centrar el bloque GPS */
          <div className="flex items-center justify-center gap-2 w-fit mx-auto">
            <Globe className="text-emerald-900/65 w-5.5 h-5.5 shrink-0" />
            <div className="flex flex-col text-left">
               <span className="text-[8.5px] font-black text-slate-600 leading-none">LAT: {Number(latitud).toFixed(6)}</span>
               <span className="text-[8.5px] font-black text-slate-600 leading-none mt-1">LNG: {Number(longitud).toFixed(6)}</span>
            </div>
            
            <Button
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-xl bg-transparent text-slate-400 hover:text-secondary hover:bg-secondary/10 transition-all duration-300 active:scale-90"
              onClick={(e) => {
                e.stopPropagation(); 
                window.open(`https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`, '_blank');
              }}
              title="Ver en Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        )
      }
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const isDeleted = !!row.original.deleted_at;

        /* CAMBIO: justify-center para centrar el badge de estado */
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

  const onEdit = (branch: Branch) => {
    setBranchToEdit(branch);
    setIsEditOpen(true);
  }

  const onDelete = (branch: Branch) => {
    setBranchToDelete(branch);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Sucursales" 
        icon={Store} 
        breadcrumbs={[ { label: "config" }, { label: "branch" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={branches}
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

      <BranchEditModal 
        branch={branchToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setBranchToEdit(null);
        }} 
      />

      <BranchCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <GenericDeleteModal
        item={branchToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setBranchToDelete(null);
        }}
        onDelete={(params) => deleteBranch(params).unwrap()}
        itemName={branchToDelete?.nombre || ""}
        itemType="esta sucursal"
        itemIdentifier="Registro de Logística"
        isSuperUser={true} 
      />
    </div>
  )
}