import { useState } from "react"
import { QrCode, Trash2, CheckCircle, CreditCard, Wallet } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { 
  useGetPaymentMethodsQuery, 
  useDeletePaymentMethodMutation 
} from "../store/paymentMethodApi" 
import { type PaymentMethod } from "../types" 
import { PaymentMethodEditModal, PaymentMethodCreateModal } from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const PaymentMethodScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [methodToEdit, setMethodToEdit] = useState<PaymentMethod | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Hook de borrado
  const [deletePaymentMethod] = useDeletePaymentMethodMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetPaymentMethodsQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const paymentMethods = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<PaymentMethod>[] = [
    {
      accessorKey: "nombre",
      header: "Método de Pago",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            {row.original.tipo === 'ONLINE' ? (
              <CreditCard className="w-4 h-4 text-secondary" />
            ) : (
              <Wallet className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <span className="font-bold text-primary uppercase tracking-tighter block">
            {row.original.nombre}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "tipo",
      header: "Tipo de Pasarela",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
            row.original.tipo === 'ONLINE' 
              ? 'bg-purple-50 text-purple-600 border-purple-100' 
              : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}>
            {row.original.tipo === 'ONLINE' ? 'PASARELA ONLINE' : 'DIRECTO / WHATSAPP'}
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

  const onEdit = (method: PaymentMethod) => {
    setMethodToEdit(method);
    setIsEditOpen(true);
  }

  const onDelete = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Métodos de Pago" 
        icon={QrCode} 
        breadcrumbs={[ { label: "Config" }, { label: "payment_method" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={paymentMethods}
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

      {/* Modales de Gestión */}
      <PaymentMethodEditModal 
        method={methodToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setMethodToEdit(null);
        }} 
      />

      <PaymentMethodCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <GenericDeleteModal
        item={methodToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setMethodToDelete(null);
        }}
        onDelete={(params) => deletePaymentMethod(params).unwrap()}
        itemName={methodToDelete?.nombre || ""}
        itemType="este método de pago"
        itemIdentifier="Configuración de Ventas"
        isSuperUser={true} 
      />
    </div>
  )
}