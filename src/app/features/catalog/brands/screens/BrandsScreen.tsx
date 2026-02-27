import { useState } from "react"
import { Briefcase, Trash2, CheckCircle } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetBrandsQuery, useDeleteBrandMutation } from "../store/brandApi" 
import { type Brand } from "../types" 
import { BrandEditModal, BrandCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const BrandsScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  // Estados para el borrado
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Hook de borrado
  const [deleteBrand] = useDeleteBrandMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetBrandsQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const brands = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre de Marca",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-bold text-primary uppercase tracking-tighter block">
          {row.original.nombre}
        </span>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        /* Agregamos mx-auto para centrar el contenedor si es más pequeño que la celda 
          y text-center para el contenido */
        <div className="max-w-[300px] py-2 mx-auto text-center"> 
          <p className="text-slate-500 text-[12px] font-medium leading-relaxed break-words whitespace-pre-wrap line-clamp-2 hover:line-clamp-none transition-all duration-300">
            {row.original.descripcion || (
              <span className="text-slate-300 italic">Sin descripción</span>
            )}
          </p>
        </div>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const isDeleted = !!row.original.deleted_at;

        if (isDeleted) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
              <Trash2 className="w-3 h-3" />
              En Papelera
            </span>
          )
        }

        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        )
      }
    }
  ]

  const onEdit = (brand: Brand) => {
    setBrandToEdit(brand);
    setIsEditOpen(true);
  }

  const onDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Marcas" 
        icon={Briefcase} 
        breadcrumbs={[ { label: "Catálogo" }, { label: "Marcas" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={brands}
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

      <BrandEditModal 
        brand={brandToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setBrandToEdit(null);
        }} 
      />

      <BrandCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <GenericDeleteModal
        item={brandToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setBrandToDelete(null);
        }}
        onDelete={(params) => deleteBrand(params).unwrap()}
        itemName={brandToDelete?.nombre || ""}
        itemType="esta marca"
        itemIdentifier="Registro de Catálogo"
        isSuperUser={true} 
      />
    </div>
  )
}