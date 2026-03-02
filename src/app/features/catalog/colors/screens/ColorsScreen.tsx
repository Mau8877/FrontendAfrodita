import { useState } from "react"
import { Palette, Trash2, CheckCircle, FolderTree } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { 
  useGetColorsQuery, 
  useDeleteColorMutation,
  useGetColorFamiliesQuery,
  useDeleteColorFamilyMutation 
} from "../store/colorApi" 
import { type Color, type FamiliaColor } from "../types" 
import { 
  ColorEditModal, 
  ColorCreateModal, 
  FamilyCreateModal, 
  FamilyEditModal 
} from "../components"
import { GenericDeleteModal } from "@/components/GenericDeleteModal"

export const ColorsScreen = () => {
  // --- ESTADOS TABLA COLORES ---
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [colorToEdit, setColorToEdit] = useState<Color | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // --- ESTADOS TABLA FAMILIAS ---
  const [famPage, setFamPage] = useState(0)
  const [famSorting, setFamSorting] = useState<SortingState>([])
  const [famSearch, setFamSearch] = useState("")
  const [famAppliedSearch, setFamAppliedSearch] = useState("")

  const [famToEdit, setFamToEdit] = useState<FamiliaColor | null>(null)
  const [isFamEditOpen, setIsFamEditOpen] = useState(false)
  const [famToDelete, setFamToDelete] = useState<FamiliaColor | null>(null)
  const [isFamDeleteOpen, setIsFamDeleteOpen] = useState(false)
  const [isFamCreateOpen, setIsFamCreateOpen] = useState(false)

  const [deleteColor] = useDeleteColorMutation()
  const [deleteFamily] = useDeleteColorFamilyMutation()

  // --- LÓGICA COLORES ---
  const ordering = sorting.length ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : undefined
  const { data: apiResponse, isFetching, refetch } = useGetColorsQuery({ 
    page: page + 1, ordering, search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => { setPage(0); setAppliedSearch(searchValue); }
  const colors = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  // --- LÓGICA FAMILIAS ---
  const famOrdering = famSorting.length ? `${famSorting[0].desc ? '-' : ''}${famSorting[0].id}` : undefined
  const { data: famApiResponse, isFetching: isFetchingFam, refetch: refetchFam } = useGetColorFamiliesQuery({ 
    page: famPage + 1, ordering: famOrdering, search: famAppliedSearch || undefined 
  })

  const handleFamSearchTrigger = () => { setFamPage(0); setFamAppliedSearch(famSearch); }
  const families = famApiResponse?.data?.results || []
  const totalCountFam = famApiResponse?.data?.count || 0
  const totalPagesFam = Math.ceil(totalCountFam / 10)

  // --- COLUMNAS (IDÉNTICAS EN ESTADO) ---
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

  const columns: ColumnDef<Color>[] = [
    {
      accessorKey: "nombre",
      header: "Color",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border border-slate-200 shadow-sm shrink-0"
            style={{ backgroundColor: row.original.codigo_hex || 'transparent' }} />
          <span className="font-bold text-primary uppercase tracking-tighter block">{row.original.nombre}</span>
        </div>
      ),
    },
    {
      accessorKey: "nombre_familia",
      header: "Familia",
      cell: ({ row }) => (
        <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
          <FolderTree className="w-3 h-3" /> {row.original.nombre_familia || "Sin Familia"}
        </span>
      )
    },
    {
      accessorKey: "codigo_hex",
      header: "Código HEX",
      cell: ({ row }) => (
        <code className="text-[11px] font-mono font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {row.original.codigo_hex || "#------"}
        </code>
      ),
    },
    { id: "estado", header: "Estado", cell: ({ row }) => renderEstadoBadge(row.original.deleted_at) }
  ]

  const famColumns: ColumnDef<FamiliaColor>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre de Familia",
      cell: ({ row }) => <span className="font-black text-primary uppercase tracking-tighter block">{row.original.nombre}</span>
    },
    { id: "estado", header: "Estado", cell: ({ row }) => renderEstadoBadge(row.original.deleted_at) }
  ]

  // --- HANDLERS ---
  const onEdit = (color: Color) => { setColorToEdit(color); setIsEditOpen(true); }
  const onDelete = (color: Color) => { setColorToDelete(color); setIsDeleteOpen(true); }
  const onAdd = () => setIsCreateOpen(true)

  const onEditFam = (fam: FamiliaColor) => { setFamToEdit(fam); setIsFamEditOpen(true); }
  const onDeleteFam = (fam: FamiliaColor) => { setFamToDelete(fam); setIsFamDeleteOpen(true); }
  const onAddFam = () => setIsFamCreateOpen(true)

  return (
    <div className="p-4 md:p-6 space-y-12 text-left">
      <PageHeader title="Gestión de Colores" icon={Palette} breadcrumbs={[ { label: "Catalog" }, { label: "Color_Management" } ]} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable columns={columns} data={colors} isFetching={isFetching} onRefresh={refetch} manualPagination={true}
          pageCount={totalPages} pageIndex={page} onPageChange={setPage} totalRecords={totalCount}
          globalFilter={searchValue} onGlobalFilterChange={setSearchValue} onSearchTrigger={handleSearchTrigger}
          sorting={sorting} onSortingChange={setSorting} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd} />
      </div>

      <PageHeader title="Gestión de Familia de Colores" icon={FolderTree} breadcrumbs={[ { label: "Catalog" }, { label: "Color_Management" } ]} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable columns={famColumns} data={families} isFetching={isFetchingFam} onRefresh={refetchFam} manualPagination={true}
          pageCount={totalPagesFam} pageIndex={famPage} onPageChange={setFamPage} totalRecords={totalCountFam}
          globalFilter={famSearch} onGlobalFilterChange={setFamSearch} onSearchTrigger={handleFamSearchTrigger}
          sorting={famSorting} onSortingChange={setFamSorting} onEdit={onEditFam} onDelete={onDeleteFam} onAdd={onAddFam} />
      </div>

      {/* MODALES */}
      <ColorEditModal color={colorToEdit} isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setColorToEdit(null); }} />
      <ColorCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <FamilyEditModal familia={famToEdit} isOpen={isFamEditOpen} onClose={() => { setIsFamEditOpen(false); setFamToEdit(null); }} />
      <FamilyCreateModal isOpen={isFamCreateOpen} onClose={() => setIsFamCreateOpen(false)} />

      <GenericDeleteModal item={colorToDelete} isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setColorToDelete(null); }}
        onDelete={(p) => deleteColor(p).unwrap()} itemName={colorToDelete?.nombre || ""} itemType="este color" itemIdentifier="Catálogo" isSuperUser />

      <GenericDeleteModal item={famToDelete} isOpen={isFamDeleteOpen} onClose={() => { setIsFamDeleteOpen(false); setFamToDelete(null); }}
        onDelete={(p) => deleteFamily(p).unwrap()} itemName={famToDelete?.nombre || ""} itemType="esta familia" itemIdentifier="Relación de Colores" isSuperUser />
    </div>
  )
}