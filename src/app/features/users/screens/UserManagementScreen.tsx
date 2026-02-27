import { useState } from "react"
import { Users, Trash2, Power, PowerOff } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetUsersQuery, useDeleteUserMutation } from "../store/usersApi"
import { type User } from "../types" 
import { UserDetailModal, UserEditModal, UserCreateModal } from "../"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const UserManagementScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [deleteUser] = useDeleteUserMutation()

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetUsersQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const users = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<User>[] = [
    {
      id: "perfil__nombre", 
      header: "Nombre Completo",
      enableSorting: true,
      accessorFn: (row) => row.perfil?.nombre, 
      cell: ({ row }) => {
        const perfil = row.original.perfil;
        const nombreCompleto = perfil?.nombre && perfil?.apellido 
          ? `${perfil.nombre} ${perfil.apellido}`
          : row.original.username;

        return (
          <div className="flex flex-col">
            <span className="font-bold text-primary uppercase tracking-tighter">
              {nombreCompleto}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              @{row.original.username}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Correo Electrónico",
      enableSorting: true,
    },
    {
      id: "id_rol__nombre", 
      header: "Rol",
      enableSorting: true,
      accessorFn: (row) => row.rol_nombre,
      cell: ({ row }) => (
        <span className="font-bold text-secondary italic uppercase text-[12px]">
          {row.original.rol_nombre}
        </span>
      )
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => {
        const active = row.original.is_active;
        const isDeleted = !!row.original.deleted_at;

        if (isDeleted && !active) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
              <Trash2 className="w-3 h-3" />
              En Papelera
            </span>
          )
        }

        if (active) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Power className="w-3 h-3" />
              Activo
            </span>
          )
        }

        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 border border-rose-200">
            <PowerOff className="w-3 h-3" />
            Inactivo
          </span>
        )
      }
    }
  ]

  const onDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  }

  const onEdit = (user: User) => {
    setUserToEdit(user);
    setIsEditOpen(true);
  }

  const onDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  }
  
  const onAdd = () => setIsCreateOpen(true)

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
          globalFilter={searchValue} 
          onGlobalFilterChange={setSearchValue} 
          onSearchTrigger={handleSearchTrigger}
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

      <UserEditModal 
        user={userToEdit} 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setUserToEdit(null);
        }} 
      />

      {/* 4. Implementación del Modal Genérico */}
      <GenericDeleteModal
        item={userToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }}
        onDelete={(params) => deleteUser(params).unwrap()}
        itemName={
          userToDelete?.perfil?.nombre 
            ? `${userToDelete.perfil.nombre} ${userToDelete.perfil.apellido}` 
            : userToDelete?.username || ""
        }
        itemType="este usuario"
        itemIdentifier={userToDelete?.email}
        isSuperUser={true}
      />

      <UserCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />
    </div>
  )
}