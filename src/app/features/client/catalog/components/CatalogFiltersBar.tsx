/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Search, RotateCcw, ArrowUp, X, Filter, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGetSelectorsQuery, useGetSearchSuggestionsQuery } from '../store'
import { type CatalogFilters as IFilters } from '../types'

interface Props {
  filters: IFilters
  onFilterChange: (newFilters: Partial<IFilters>) => void
  onReset: () => void
}

// --- SUB-COMPONENTE: SECCIÓN DE FILTROS ---
const FilterSection = ({ 
  title, 
  items, 
  filterKey, 
  currentValue, 
  onSelect 
}: { 
  title: string, 
  items: any[], 
  filterKey: keyof IFilters, 
  currentValue?: string | number,
  onSelect: (key: keyof IFilters, value: string) => void
}) => (
  <div className="space-y-2.5">
    <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-primary/70 px-1">{title}</h3>
    <div className="flex flex-row md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-2 custom-scrollbar snap-x">
      {items?.map((item: any) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(filterKey, item.nombre)}
          className={`snap-start whitespace-nowrap flex items-center justify-center px-3.5 py-1.5 md:py-2 rounded-2xl text-[9px] md:text-[10px] font-bold transition-all ${
            currentValue === item.nombre
              ? "bg-secondary text-white shadow-md shadow-secondary/30 scale-105"
              : "bg-white text-slate-500 border border-transparent hover:border-primary/20 hover:bg-primary/5 shadow-sm"
          }`}
        >
          {item.nombre.toUpperCase()}
          {currentValue === item.nombre && <X size={12} className="ml-1.5 opacity-90" />}
        </button>
      ))}
    </div>
  </div>
)

export function CatalogFiltersBar({ filters, onFilterChange, onReset }: Props) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [debouncedSearch, setDebouncedSearch] = useState(localSearch)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false) 
  
  const { data: selectors, isLoading } = useGetSelectorsQuery()

  if (filters.search !== undefined && filters.search !== localSearch && !showSuggestions) {
    setLocalSearch(filters.search);
  }

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(localSearch), 500);
    return () => clearTimeout(handler);
  }, [localSearch]);

  const { data: suggestions, isFetching: isSearching } = useGetSearchSuggestionsQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length < 3,
  })

  const releaseFocus = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  const handleApplySearch = () => {
    onFilterChange({ search: localSearch, page: 1 })
    setShowSuggestions(false)
    releaseFocus();
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const layouts = document.querySelectorAll('main, #root, .overflow-y-auto');
    layouts.forEach(el => el.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  if (isLoading) return <aside className="w-full md:w-[320px] shrink-0 p-8 animate-pulse bg-primary/15 rounded-[2rem]" />;

  return (
    <aside className="w-full md:w-[320px] shrink-0 sticky top-0 md:top-6 self-start z-40">
      {/* Añadí z-40 aquí arriba y un fondo blanco sólido para móvil. 
        Esto evitará que las fotos de los productos "traspasen" la burbuja.
      */}
      <div className="flex flex-col bg-white md:bg-primary/15 rounded-b-[2rem] md:rounded-[2.5rem] shadow-lg md:shadow-primary/10 border-b md:border border-white/40 max-h-[90vh] md:max-h-[85vh] transition-all duration-300 relative z-50">
        
        {/* HEADER */}
        <div className="p-4 md:p-6 pb-4 shrink-0 bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex items-center gap-1.5 text-primary font-black text-xs tracking-widest uppercase"
            >
              <Filter size={15} /> Filtros 
              <span className="md:hidden ml-1">
                {isMobileOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              </span>
            </button>
            <div className="flex gap-1.5">
              <button onClick={scrollToTop} className="p-2 bg-white text-slate-400 hover:text-primary rounded-xl shadow-sm"><ArrowUp size={14} /></button>
              <button onClick={() => { onReset(); setIsMobileOpen(false); }} className="p-2 bg-white text-slate-400 hover:text-primary rounded-xl shadow-sm"><RotateCcw size={14} /></button>
            </div>
          </div>

          <div className="relative">
            <Input
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplySearch()}
              onFocus={() => { setShowSuggestions(true); setIsMobileOpen(true); }}
              placeholder="¿Qué lente buscas?..."
              className="h-10 md:h-11 rounded-2xl border-none bg-slate-50 md:bg-white shadow-inner md:shadow-sm px-10 text-[10px] md:text-xs font-bold"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 cursor-pointer" onClick={handleApplySearch} />
            {isSearching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary w-3.5 h-3.5 animate-spin" />}

            {/* SUGERENCIAS */}
            {showSuggestions && debouncedSearch.trim().length >= 3 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                <div className="p-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                  {suggestions?.data?.map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLocalSearch(item.nombre);
                        onFilterChange({ search: item.nombre, page: 1 });
                        setShowSuggestions(false);
                        releaseFocus();
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 rounded-2xl text-left border-b border-slate-50 last:border-none"
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                        {item.imagen_url && <img src={item.imagen_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-700 uppercase">{item.nombre}</span>
                        <span className="text-[8px] font-bold text-slate-400 font-mono">{item.sku}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENIDO FILTROS */}
        <div className={`flex-1 overflow-y-auto persistent-scrollbar px-4 md:px-6 pb-6 pt-2 space-y-8 ${isMobileOpen ? 'block' : 'hidden md:block'}`}>
          <FilterSection title="Tipos" items={selectors?.data.tipos || []} filterKey="tipo" currentValue={filters?.tipo} onSelect={(k, v) => onFilterChange({ [k]: filters[k] === v ? undefined : v, page: 1 })} />
          <FilterSection title="Tonos" items={selectors?.data.tonos || []} filterKey="tonos" currentValue={filters?.tonos} onSelect={(k, v) => onFilterChange({ [k]: filters[k] === v ? undefined : v, page: 1 })} />
          <FilterSection title="Marcas" items={selectors?.data.marcas || []} filterKey="marca" currentValue={filters?.marca} onSelect={(k, v) => onFilterChange({ [k]: filters[k] === v ? undefined : v, page: 1 })} />
          <FilterSection title="Categorías" items={selectors?.data.categorias || []} filterKey="categoria" currentValue={filters?.categoria} onSelect={(k, v) => onFilterChange({ [k]: filters[k] === v ? undefined : v, page: 1 })} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .persistent-scrollbar::-webkit-scrollbar { width: 4px; }
        .persistent-scrollbar::-webkit-scrollbar-thumb { background: rgba(178, 87, 201, 0.3); border-radius: 10px; }
      `}} />

      {/* Overlay para cerrar sugerencias */}
      {showSuggestions && <div className="fixed inset-0 z-30" onClick={() => setShowSuggestions(false)} />}
    </aside>
  )
}