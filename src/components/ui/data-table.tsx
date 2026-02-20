import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useState, type ReactNode } from "react"
import { 
  RefreshCw, Search, ChevronLeft, ChevronRight, 
  ArrowUpDown, Eye, EyeOff, Pencil, Trash2, ClipboardList, Plus 
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { Input } from "./input"

// ── INTERFAZ ACTUALIZADA ──
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRefresh?: () => void
  isFetching?: boolean
  extraFilters?: ReactNode
  onView?: (data: TData) => void
  onEdit?: (data: TData) => void
  onDelete?: (data: TData) => void
  onDetail?: (data: TData) => void
  onAdd?: () => void
  // Paginación
  pageCount?: number
  pageIndex?: number
  onPageChange?: (index: number) => void
  manualPagination?: boolean
  // Sorting & Filtering
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  globalFilter?: string
  onGlobalFilterChange?: (filter: string) => void
  onSearchTrigger?: () => void // Para disparar la búsqueda con Enter o Botón
  totalRecords?: number
}

function ActionButtons<TData>({ 
  data, onView, onEdit, onDelete, onDetail 
}: { 
  data: TData, 
  onView?: (d: TData) => void, 
  onEdit?: (d: TData) => void, 
  onDelete?: (d: TData) => void,
  onDetail?: (d: TData) => void 
}) {
  const [isOpen, setIsOpen] = useState(true);

  

  return (
    <div className="flex items-center justify-center gap-1">
      {onView && (
        <Button 
          variant="ghost" size="icon" 
          className="h-8 w-8 text-secondary hover:bg-secondary/10"
          onClick={() => {
            setIsOpen(!isOpen);
            onView(data);
          }}
        >
          {isOpen ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      )}
      
      {onDetail && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary hover:bg-secondary/10" onClick={() => onDetail(data)}>
          <ClipboardList className="h-4 w-4" />
        </Button>
      )}

      {onEdit && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary hover:bg-secondary/10" onClick={() => onEdit(data)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {onDelete && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => onDelete(data)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRefresh,
  isFetching = false,
  extraFilters,
  onView,
  onEdit,
  onDelete,
  onDetail,
  onAdd,
  pageCount,
  pageIndex = 0,
  onPageChange,
  sorting,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  onSearchTrigger,
  totalRecords = 0,
}: DataTableProps<TData, TValue>) {
  
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalFilter, setInternalFilter] = useState("")

  const finalColumns = [
    ...columns,
    ...(onView || onEdit || onDelete || onDetail ? [{
      id: "actions",
      header: "Acciones",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => (
        <ActionButtons data={row.original} onView={onView} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
      )
    }] : [])
  ] as ColumnDef<TData, TValue>[]

  const table = useReactTable({
    data,
    columns: finalColumns,
    pageCount: pageCount ?? -1,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: { 
        globalFilter: globalFilter ?? internalFilter, 
        sorting: sorting ?? internalSorting,
        pagination: {
            pageIndex,
            pageSize: 10,
        }
    },
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalFilter,
    onSortingChange: (updater) => {
        const nextState = typeof updater === 'function' 
            ? updater(sorting ?? internalSorting) 
            : updater;
        if (onSortingChange) onSortingChange(nextState);
        else setInternalSorting(nextState);
    },
    onPaginationChange: (updater) => {
        if (onPageChange) {
            const nextState = typeof updater === 'function' 
                ? updater(table.getState().pagination) 
                : updater;
            onPageChange(nextState.pageIndex);
        }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const pageSize = 10;
  const from = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRecords);

  return (
    <div className="space-y-4 bg-white p-1 rounded-xl w-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow">
          {/* BUSCADOR CON BOTÓN */}
          <div className="flex items-center gap-2 w-full md:max-w-[480px]">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <Input
                placeholder="Buscar en el sistema..."
                value={globalFilter ?? internalFilter}
                onChange={(e) => {
                    const val = e.target.value;
                    if (onGlobalFilterChange) onGlobalFilterChange(val);
                    else setInternalFilter(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearchTrigger) {
                    onSearchTrigger();
                  }
                }}
                className="pl-9 border-primary/20 focus-visible:ring-secondary bg-white h-10 md:h-9 w-full text-xs font-medium"
              />
            </div>
            <Button 
              size="sm" 
              onClick={onSearchTrigger}
              className="h-10 md:h-9 bg-primary hover:bg-primary/90 text-white px-3"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full sm:w-auto flex justify-center">
             {extraFilters}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center md:justify-end">
          {onRefresh && (
            <Button 
              variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}
              className="flex-1 md:flex-none border-primary/40 text-secondary font-bold hover:bg-primary hover:text-white transition-all active:scale-95 bg-white h-10 md:h-9 shadow-sm px-4"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              <span className="text-[11px] uppercase tracking-wider">{isFetching ? 'Actualizando...' : 'Actualizar'}</span>
            </Button>
          )}

          {onAdd && (
            <Button 
              size="icon" onClick={onAdd}
              className="h-10 md:h-9 w-10 md:w-9 bg-secondary hover:bg-secondary/90 text-white shadow-md active:scale-90 transition-all flex-shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-primary/20 border-b border-primary/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="font-bold text-primary uppercase text-[13px] tracking-tight h-12 text-center border-x border-primary/10 last:border-r-0"
                    >
                      {header.isPlaceholder ? null : (
                        <div 
                          className={`flex items-center justify-center gap-1.5 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-secondary transition-colors' : ''}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="group border-b border-primary/10 hover:bg-primary/5 transition-colors text-center">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-[11px] md:text-xs font-medium text-foreground/80 border-x border-primary/5 last:border-r-0 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={finalColumns.length} className="h-32 text-center bg-white text-primary font-bold animate-pulse uppercase tracking-widest text-xs">
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINACIÓN + CONTEO DE DATOS */}
      <div className="flex flex-col items-center justify-center py-4 mt-1 border-t border-primary/5 bg-white space-y-3">
        <div className="flex items-center gap-3 sm:gap-6">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="border-primary/30 text-secondary font-bold px-3 sm:px-6 h-10 md:h-9">
            <ChevronLeft className="h-4 w-4 sm:mr-1" /> 
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Anterior</span>
          </Button>
          
          <div className="flex items-center justify-center bg-primary/10 px-5 py-2 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary min-w-[120px] sm:min-w-[180px]">
             PÁGINA {table.getState().pagination.pageIndex + 1} DE {table.getPageCount() || 1}
          </div>

          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="border-primary/30 text-secondary font-bold px-3 sm:px-6 h-10 md:h-9">
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Siguiente</span>
            <ChevronRight className="h-4 w-4 sm:ml-1" />
          </Button>
        </div>

        {/* --- EL CONTEO PROFESIONAL --- */}
        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
            Mostrando <span className="text-secondary">{from}</span> a <span className="text-secondary">{to}</span> de <span className="text-secondary">{totalRecords}</span> resultados
        </div>
      </div>
    </div>
  )
}