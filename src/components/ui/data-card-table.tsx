import {
  type ColumnDef,
  // flexRender,
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
  Eye, Pencil, Trash2, ClipboardList, Plus, ImageIcon 
} from "lucide-react"

import { Button } from "./button"
import { Input } from "./input"

interface DataCardTableProps<TData, TValue> {
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
  onSearchTrigger?: () => void 
  totalRecords?: number
  // Opciones de ocultamiento
  hideSearch?: boolean
  hideToolbar?: boolean
  hidePagination?: boolean
  // Renderizador personalizado de la Card (Vital para productos)
  renderCard: (data: TData, actions: ReactNode) => ReactNode
}

function CardActionButtons<TData>({ 
  data, onView, onEdit, onDelete, onDetail 
}: { 
  data: TData, 
  onView?: (d: TData) => void, 
  onEdit?: (d: TData) => void, 
  onDelete?: (d: TData) => void,
  onDetail?: (d: TData) => void 
}) {
  return (
    <div className="flex items-center justify-end gap-1 mt-auto pt-4 border-t border-primary/5">
      {onView && (
        <Button 
          variant="ghost" size="icon" 
          className="h-8 w-8 text-secondary hover:bg-secondary/10"
          onClick={() => onView(data)}
        >
          <Eye className="h-4 w-4" />
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

export function DataCardTable<TData, TValue>({
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
  hideSearch = false,
  hideToolbar = false,
  hidePagination = false,
  renderCard,
}: DataCardTableProps<TData, TValue>) {
  
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalFilter, setInternalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
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
    <div className="space-y-4 w-full">
      
      {/* TOOLBAR - IGUAL AL ORIGINAL */}
      {!hideToolbar && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow">
            {!hideSearch && (
              <div className="flex items-center gap-2 w-full md:max-w-[480px]">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <Input
                    placeholder="Buscar productos..."
                    value={globalFilter ?? internalFilter}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (onGlobalFilterChange) onGlobalFilterChange(val);
                        else setInternalFilter(val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && onSearchTrigger) onSearchTrigger();
                    }}
                    className="pl-9 border-primary/20 focus-visible:ring-secondary bg-white h-10 md:h-9 w-full text-xs font-medium"
                  />
                </div>
                <Button size="sm" onClick={onSearchTrigger} className="h-10 md:h-9 bg-primary hover:bg-primary/90 text-white px-3">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="w-full sm:w-auto flex justify-center">{extraFilters}</div>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-end">
            {onRefresh && (
              <Button 
                variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}
                className="flex-1 md:flex-none border-primary/40 text-secondary font-bold hover:bg-primary hover:text-white transition-all bg-white h-10 md:h-9 px-4"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="text-[11px] uppercase tracking-wider">{isFetching ? 'Actualizando...' : 'Actualizar'}</span>
              </Button>
            )}

            {onAdd && (
              <Button 
                size="icon" onClick={onAdd}
                className="h-10 md:h-9 w-10 md:w-9 bg-secondary hover:bg-secondary/90 text-white shadow-md transition-all flex-shrink-0"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* GRID DE CARDS EN LUGAR DE TABLA */}
      <div className="min-h-[400px]">
        {isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[320px] rounded-[2rem] bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : table.getRowModel().rows?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="h-full">
                {renderCard(row.original, (
                  <CardActionButtons 
                    data={row.original} 
                    onView={onView} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onDetail={onDetail} 
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-dashed border-primary/20">
            <ImageIcon className="w-12 h-12 text-primary/20 mb-2" />
            <p className="text-primary font-black uppercase tracking-widest text-xs">No hay productos en el catálogo</p>
          </div>
        )}
      </div>

      {/* PAGINACIÓN - IGUAL AL ORIGINAL */}
      {!hidePagination && (
        <div className="flex flex-col items-center justify-center py-6 border-t border-primary/5 space-y-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="border-primary/30 text-secondary font-bold px-6 h-9">
              <ChevronLeft className="h-4 w-4" /> 
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Anterior</span>
            </Button>
            
            <div className="flex items-center justify-center bg-primary/10 px-5 py-2 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary min-w-[180px]">
                PÁGINA {table.getState().pagination.pageIndex + 1} DE {table.getPageCount() || 1}
            </div>

            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="border-primary/30 text-secondary font-bold px-6 h-9">
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
              Mostrando <span className="text-secondary">{from}</span> a <span className="text-secondary">{to}</span> de <span className="text-secondary">{totalRecords}</span> resultados
          </div>
        </div>
      )}
    </div>
  )
}