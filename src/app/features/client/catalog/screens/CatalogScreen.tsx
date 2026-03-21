/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2, ImageIcon, ArrowUp, Check } from 'lucide-react'
import { useGetCatalogQuery } from '../store'
import { type CatalogFilters as IFilters } from '../types'
import { CatalogFiltersBar } from '../components/CatalogFiltersBar'
import { ProductClientCard } from "@/components/ui/data-card-table-client"
import { Button } from '@/components/ui/button'

export function CatalogScreen() {
  const searchParams = useSearch({ strict: false }) as unknown as IFilters
  const navigate = useNavigate()

  const { data, isFetching } = useGetCatalogQuery(searchParams)
  
  const products = data?.data.results || []
  const hasNextPage = !!data?.data.next
  const totalCount = data?.data.count || 0

  const handleFilterChange = (newParams: Partial<IFilters>) => {
    (navigate as any)({
      search: (prev: any) => ({ 
        ...prev, 
        ...newParams, 
        page: 1 
      }),
      replace: true 
    })
  }

  const handleReset = () => {
    (navigate as any)({
      search: () => ({ 
        page: 1, 
        search: '',
        tipo: undefined,
        marca: undefined,
        categoria: undefined,
        tonos: undefined 
      }),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      (navigate as any)({
        search: (prev: any) => ({ 
          ...prev, 
          page: (Number(prev?.page) || 1) + 1 
        }),
      })
    }
  }

  // --- NUEVAS FUNCIONES DE CONEXIÓN ---

  const handleGoToDetail = (productId: string) => {
    (navigate as any)({
      // Usamos la ruta limpia que creamos en catalog.product.$productId.tsx
      to: '/catalog/product/$productId',
      params: { productId },
      // IMPORTANTE: Al no pasar el objeto 'search', la URL se limpia de los filtros del catálogo
    })
  }

  const handleAddToCart = (product: any) => {
    // Aquí irá tu lógica de Redux para el carrito más adelante
    console.log("Añadido al carrito:", product.nombre)
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF]">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-4 md:py-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          
          <CatalogFiltersBar 
            filters={searchParams} 
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          <main className="flex-1 w-full relative z-0">
            {/* Título y Contador */}
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
                   <span>{totalCount} Productos encontrados</span>
                )}
                <span className="hidden md:block h-[1px] w-6 bg-slate-200" />
              </div>
            </div>

            {/* Grid de productos */}
            {isFetching && (Number(searchParams.page) || 1) === 1 ? (
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
                    // CONECTAMOS LAS ACCIONES AQUÍ:
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => handleGoToDetail(p.id)}
                  />
                ))}
              </div>
            ) : !isFetching && (
              <div className="w-full py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                <ImageIcon className="w-10 h-10 text-slate-200 mb-5" />
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-slate-400 text-center px-10 max-w-md">
                  No encontramos modelos que coincidan con tu búsqueda
                </p>
              </div>
            )}

            {/* SECCIÓN FINAL DE PAGINACIÓN */}
            <div className="mt-24 mb-20 flex flex-col items-center justify-center min-h-[120px]">
              {hasNextPage && !isFetching && (
                  <Button 
                    onClick={loadMore} 
                    className="relative group overflow-hidden rounded-full bg-secondary text-white px-20 h-16 font-black uppercase text-[11px] tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  >
                    Explorar más modelos
                    <ArrowUp className="ml-3 w-4 h-4 rotate-180" />
                  </Button>
              )}

              {isFetching && (Number(searchParams.page) || 0) > 1 && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-secondary" size={32} />
                  <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Cargando...</span>
                </div>
              )}

              {!hasNextPage && !isFetching && products.length > 0 && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                  <div className="h-12 w-12 rounded-full bg-primary/25 border border-primary/35 flex items-center justify-center shadow-sm">
                    <Check className="text-secondary w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                      Has llegado al final
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                      Exploraste todos nuestros modelos disponibles
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}