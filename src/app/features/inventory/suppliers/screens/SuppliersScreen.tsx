import { useState } from "react"
import { Trash2, CheckCircle, Phone, Handshake } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetSuppliersQuery, useDeleteSupplierMutation } from "../store" 
import { type Supplier } from "../types" 
import { SupplierEditModal, SupplierCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const SuppliersScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  // Estados para el borrado
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Hook de borrado
  const [deleteSupplier] = useDeleteSupplierMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetSuppliersQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const suppliers = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "nombre",
      header: "Proveedor",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-bold text-primary uppercase tracking-tighter block">
          {row.original.nombre}
        </span>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Contacto / Teléfono",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <Phone className="w-3 h-3 text-slate-400" />
          <span className="text-[12px] font-medium">
            {row.original.telefono || (
              <span className="text-slate-300 italic">Sin teléfono</span>
            )}
          </span>
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

  const onEdit = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setIsEditOpen(true);
  }

  const onDelete = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Proveedores" 
        icon={Handshake} 
        breadcrumbs={[ { label: "Inventory" }, { label: "Suppliers" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={suppliers}
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

      <SupplierEditModal 
        supplier={supplierToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setSupplierToEdit(null);
        }} 
      />

      <SupplierCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <GenericDeleteModal
        item={supplierToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSupplierToDelete(null);
        }}
        onDelete={(params) => deleteSupplier(params).unwrap()}
        itemName={supplierToDelete?.nombre || ""}
        itemType="este proveedor"
        itemIdentifier="Registro de Abastecimiento"
        isSuperUser={true} 
      />
    </div>
  )
}