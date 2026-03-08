/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { PackageCheck, Badge, Layers } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { useGetStockQuery } from "../store/stockApi" 
import { type ProductStock } from "../types" 
import { StockDetailModal } from "../components/StockDetailModal"

export const StockScreen = () => {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : 'nombre'

  const { data: apiResponse, isFetching, refetch } = useGetStockQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const stockData = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<ProductStock>[] = [
    {
      accessorKey: "nombre",
      header: "Producto",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary uppercase tracking-tighter text-[13px] leading-tight">
            {row.original.nombre}
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-bold italic">
            SKU: {row.original.sku || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "marca_nombre",
      header: "Marca",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge className="w-3 h-3 text-secondary/40" />
          <span className="text-[11px] font-bold text-slate-600 uppercase italic">
            {row.original.marca_nombre}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "total_stock",
      header: () => <div className="text-center">Existencia Total</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const stock = row.original.total_stock;
        const isLow = stock <= 5;
        
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-xl text-sm font-black border transition-all shadow-sm ${
              stock === 0 
                ? 'bg-rose-50 text-rose-600 border-rose-100 opacity-50' 
                : isLow 
                ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
              <Layers className="w-3.5 h-3.5" />
              {stock} <span className="text-[10px] opacity-60">UNITS</span>
            </span>
          </div>
        )
      }
    },
  ]

  const onDetail = (product: ProductStock) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Control Stock" 
        icon={PackageCheck} 
        breadcrumbs={[ { label: "Inventory" }, { label: "Stock" } ]} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={stockData}
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
          onDetail={onDetail}
        />
      </div>

      <StockDetailModal 
        productId={selectedProduct?.id} 
        isOpen={isDetailOpen} 
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProduct(null);
        }} 
      />
    </div>
  )
}