import { useState } from "react"
import { Package, LayoutGrid } from "lucide-react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"

import { PageHeader } from "@/components/ui/page-header"
import { DataCardTable } from "@/components/ui/data-card-table"
import { ProductCardItem } from "@/components/ProductCardItem"
import { useGetProductsQuery } from "../store/productApi" 
import { type Product } from "../types" 

export const ProductViewScreen = () => {
  // --- ESTADOS DE TABLA / GRILLA ---
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("") 
  const [appliedSearch, setAppliedSearch] = useState("") 

  const ordering = sorting.length 
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` 
    : undefined

  const { data: apiResponse, isFetching, refetch } = useGetProductsQuery({ 
    page: page + 1, 
    ordering, 
    search: appliedSearch || undefined 
  })

  // --- HANDLERS ---
  const handleSearchTrigger = () => {
    setPage(0)
    setAppliedSearch(searchValue) 
  }

  const products = apiResponse?.data?.results || []
  const totalCount = apiResponse?.data?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "nombre", header: "Producto", enableSorting: true },
    { accessorKey: "precio_venta", header: "Precio", enableSorting: true },
    { accessorKey: "created_at", header: "Fecha", enableSorting: true },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Catálogo de Productos" 
        icon={Package} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Products_Management" } ]} 
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-primary/60">
            <LayoutGrid className="w-4 h-4" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Vista de Galería Directa</h2>
        </div>

        <DataCardTable 
          columns={columns} 
          data={products}
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
          renderCard={(product) => (
            <ProductCardItem 
                product={product as Product} 
                showVisibilityToggle={false}
            />
          )}
        />
      </div>
    </div>
  )
}