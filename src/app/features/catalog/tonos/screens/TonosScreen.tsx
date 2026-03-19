import { useState } from "react"
import { SwatchBook, Trash2, CheckCircle } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetTonosQuery, useDeleteTonoMutation } from "../store" 
import { type Tono } from "../types" 
import { TonoEditModal, TonoCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const TonosScreen = () => {
  // --- ESTADOS TABLA TONOS ---
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [tonoToEdit, setTonoToEdit] = useState<Tono | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [tonoToDelete, setTonoToDelete] = useState<Tono | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [deleteTono] = useDeleteTonoMutation()

  // --- LÓGICA TONOS ---
  const ordering = sorting.length ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : undefined
  const { data: apiResponse, isFetching, refetch } = useGetTonosQuery({ 
    page: page + 1, ordering, search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => { 
    setPage(0)
    setAppliedSearch(searchValue)
  }

  const tonos = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  // --- COMPONENTES VISUALES ---
  const renderEstadoBadge = (deletedAt: string | null) => {
    if (deletedAt) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
          <Trash2 className="w-3 h-3" /> En Papelera
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3" /> Activo
      </span>
    )
  }

  // --- COLUMNAS DE LA TABLA ---
  const columns: ColumnDef<Tono>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre del Tono",
      cell: ({ row }) => (
        <span className="font-black text-primary uppercase tracking-tighter block text-[13px]">
          {row.original.nombre}
        </span>
      ),
    },
    { 
      id: "estado", 
      header: "Estado", 
      cell: ({ row }) => renderEstadoBadge(row.original.deleted_at) 
    }
  ]

  // --- HANDLERS ---
  const onEdit = (tono: Tono) => { setTonoToEdit(tono); setIsEditOpen(true); }
  const onDelete = (tono: Tono) => { setTonoToDelete(tono); setIsDeleteOpen(true); }
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-8 text-left max-w-7xl mx-auto">
      
      <PageHeader 
        title="Gestionar Tonos" 
        icon={SwatchBook} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Tonos_Management" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={tonos} 
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
          onEdit={onEdit} 
          onDelete={onDelete} 
          onAdd={onAdd} 
        />
      </div>

      {/* MODALES */}
      {isEditOpen && (
        <TonoEditModal 
          tono={tonoToEdit} 
          isOpen={isEditOpen} 
          onClose={() => { setIsEditOpen(false); setTonoToEdit(null); }} 
        />
      )}
      
      {isCreateOpen && (
        <TonoCreateModal 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
        />
      )}

      <GenericDeleteModal 
        item={tonoToDelete} 
        isOpen={isDeleteOpen} 
        onClose={() => { setIsDeleteOpen(false); setTonoToDelete(null); }}
        onDelete={(p) => deleteTono(p).unwrap()} 
        itemName={tonoToDelete?.nombre || ""} 
        itemType="este tono" 
        itemIdentifier="Catálogo" 
        isSuperUser 
      />

    </div>
  )
}