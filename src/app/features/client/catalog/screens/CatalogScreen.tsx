/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Loader2, ImageIcon, ArrowUp} from 'lucide-react'
import { useGetCatalogQuery } from '../store'
import { type CatalogFilters as IFilters } from '../types'
import { CatalogFiltersBar } from '../components/CatalogFiltersBar'
import { ProductClientCard } from "@/components/ui/data-card-table-client"
import { Button } from '@/components/ui/button'

export function CatalogScreen() {
  const [filters, setFilters] = useState<IFilters>({ page: 1, search: '' })
  const { data, isFetching } = useGetCatalogQuery(filters)
  
  const products = data?.data.results || []
  const hasNextPage = !!data?.data.next

  const handleFilterChange = (newParams: Partial<IFilters>) => {
    setFilters(prev => ({ ...prev, ...newParams, page: 1 }))
  }

  const handleReset = () => {
    setFilters({ page: 1, search: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF]">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-4 md:py-10">
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          
          {/* SIDEBAR DE FILTROS */}
          <CatalogFiltersBar 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* CONTENIDO PRINCIPAL */}
          <main className="flex-1 w-full relative z-0">
            
            {/* ENCABEZADO ESTILO HOME */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-center md:text-left items-center md:items-end">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-secondary">
                    Explorar
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                  Catálogo de Productos
                </h2>
              </div>
              
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                {isFetching ? (
                   <span className="animate-pulse">Sincronizando...</span>
                ) : (
                   <span>{data?.data.count || 0} Productos encontrados</span>
                )}
                <span className="hidden md:block h-[1px] w-6 bg-slate-200" />
              </div>
            </div>

            {/* LÓGICA DE RENDERIZADO DEL GRID */}
            {isFetching && filters.page === 1 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4.5] rounded-[2rem] md:rounded-[3rem] bg-slate-50 animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
                {products.map((product) => (
                  <ProductClientCard 
                    key={product.id}
                    product={product as any} 
                    onAddToCart={(p) => console.log("Carrito:", p.nombre)}
                    onQuickView={(p) => console.log("Detalle:", p.id)}
                  />
                ))}
              </div>
            ) : !isFetching && (
              <div className="w-full py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                <div className="p-5 rounded-full bg-white shadow-sm mb-5">
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-slate-400 text-center px-10 max-w-md leading-relaxed">
                  Lo sentimos, no encontramos modelos que coincidan con tu búsqueda actual
                </p>
              </div>
            )}

            {/* SECCIÓN DE CARGA / LOAD MORE */}
            <div className="mt-24 mb-20 flex flex-col items-center justify-center min-h-[120px] relative">
    
              {/* Decoración de fondo suave para el botón */}
              {hasNextPage && !isFetching && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-3xl pointer-events-none">
                      <div className="w-64 h-24 bg-secondary rounded-full" />
                  </div>
              )}

              {hasNextPage && !isFetching && (
                  <Button 
                    onClick={loadMore} 
                    className="relative group overflow-hidden rounded-full bg-secondary text-white px-20 h-16 font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-secondary/40 border border-white/10"
                  >
                      {/* Efecto de brillo al pasar el mouse */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <span className="relative flex items-center gap-3">
                          Explorar más modelos
                          <ArrowUp className="w-4 h-4 rotate-180 group-hover:translate-y-1 transition-transform" />
                      </span>
                  </Button>
              )}

              {isFetching && filters.page! > 1 && (
                  <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                          <Loader2 className="animate-spin text-secondary" size={32} strokeWidth={3} />
                          <div className="absolute inset-0 blur-md bg-secondary/20 animate-pulse rounded-full" />
                      </div>
                      <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
                          Actualizando catálogo
                      </span>
                  </div>
              )}

              {/* Indicador de fin de catálogo si ya no hay más */}
              {!hasNextPage && products.length > 0 && (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="h-[1px] w-12 bg-slate-300" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                          Has llegado al final
                      </span>
                  </div>
              )}
          </div>
          </main>
        </div>
      </div>
    </div>
  )
}