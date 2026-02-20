import { useState } from "react"
import { Users } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"
import { toast } from "sonner"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetUsersQuery } from "../store/usersApi" 
import { type User } from "../types" 
import { UserDetailModal } from "../"

export const UserManagementScreen = () => {
  // 1. ESTADOS DE CONTROL
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  
  // 2. ESTADOS DE BÚSQUEDA (El truco para evitar los 500 GETs)
  const [searchValue, setSearchValue] = useState("") // Lo que el usuario escribe
  const [appliedSearch, setAppliedSearch] = useState("") // Lo que realmente mandamos al server

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // 3. CONSTRUCCIÓN DE PARÁMETROS
  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  // 4. QUERY ÚNICA (Solo reacciona cuando appliedSearch cambia)
  const { data: apiResponse, isFetching, refetch } = useGetUsersQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  // 5. LÓGICA DE DISPARO DE BÚSQUEDA
  const handleSearchTrigger = () => {
    setPage(0) // Resetear a la primera página al buscar algo nuevo
    setAppliedSearch(searchValue) // Aquí es donde ocurre el GET real
  }

  const users = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  // 6. COLUMNAS
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Usuario",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Correo Electrónico",
      enableSorting: false,
    },
    {
      accessorKey: "rol_nombre",
      header: "Rol",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-bold text-secondary italic">
          {row.getValue("rol_nombre")}
        </span>
      )
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      enableSorting: false,
      cell: ({ row }) => {
        const active = row.getValue("is_active") as boolean
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {active ? 'Activo' : 'Inactivo'}
          </span>
        )
      }
    }
  ]

  // Handlers de acciones
  const onDetail = (user: User) => {
    setSelectedUser(user); // Pasamos el objeto completo con perfil y anidados
    setIsDetailOpen(true);
  }

  const onEdit = (user: User) => toast.warning(`Editando: ${user.username}`)
  const onDelete = (user: User) => toast.error(`Eliminar: ${user.username}`)
  const onAdd = () => toast.success("Nuevo usuario")

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Usuarios" 
        icon={Users} 
        breadcrumbs={[ { label: "Users" }, { label: "Management" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={users}
          isFetching={isFetching}
          onRefresh={refetch}
          manualPagination={true}
          pageCount={totalPages}
          pageIndex={page}
          onPageChange={(newIndex) => setPage(newIndex)}
          totalRecords={totalCount}
          // --- SINCRONIZACIÓN CON DATATABLE ---
          globalFilter={searchValue} 
          onGlobalFilterChange={setSearchValue} // Actualiza el input visualmente
          onSearchTrigger={handleSearchTrigger} // Solo dispara el GET al dar Enter/Click
          
          sorting={sorting}
          onSortingChange={setSorting}
          
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      </div>

      <UserDetailModal 
        user={selectedUser} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />
    </div>
  )
}