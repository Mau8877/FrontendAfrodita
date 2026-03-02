import { useState } from "react"
import { Tags, Trash2, CheckCircle } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../store/categoriesApi" 
import { type Category } from "../types" 
import { CategoryEditModal, CategoryCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const CategoriesScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  // Estados para el borrado
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Hook de borrado
  const [deleteCategory] = useDeleteCategoryMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetCategoriesQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const categories = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre de Categoría",
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
      enableSorting: false,
      cell: ({ row }) => (
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

  const onEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditOpen(true);
  }

  const onDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Categorías" 
        icon={Tags} 
        breadcrumbs={[ { label: "Catalog" }, { label: "categories_management" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={categories}
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

      <CategoryEditModal 
        category={categoryToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setCategoryToEdit(null);
        }} 
      />

      <CategoryCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <GenericDeleteModal
        item={categoryToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        onDelete={(params) => deleteCategory(params).unwrap()}
        itemName={categoryToDelete?.nombre || ""}
        itemType="esta categoría"
        itemIdentifier="Registro de Catálogo"
        isSuperUser={true} 
      />
    </div>
  )
}