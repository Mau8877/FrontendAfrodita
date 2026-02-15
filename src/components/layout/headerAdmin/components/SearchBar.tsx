import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="flex items-center">
      {/* LUPA MÓVIL */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="sm:hidden text-secondary"
      >
        <Search className="h-6 w-6" strokeWidth={2.5} />
      </Button>

      {/* BUSCADOR EXPANDIBLE */}
      <div className={`
        ${isOpen ? 'flex' : 'hidden'} 
        sm:flex items-center 
        absolute inset-0 sm:relative sm:inset-auto
        bg-header sm:bg-transparent
        z-[100] px-4 sm:px-0 sm:ml-4 sm:max-w-xs w-full
        animate-in slide-in-from-top-2 duration-200
      `}>
        <div className="relative flex items-center w-full h-full">
          
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-secondary/70" />
          
          <Input
            autoFocus={isOpen}
            type="text"
            placeholder="¿Qué buscas?"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            maxLength={50}
            className="w-full pl-10 pr-24 bg-white border-none focus-visible:ring-2 focus-visible:ring-secondary/40 h-10 rounded-xl shadow-sm text-[15px] font-medium text-slate-700 placeholder:text-slate-400"
          />
          
          {/* BLOQUE DE CONTROL DERECHO COMPACTO */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2.5">
            
            {/* LA X */}
            {searchValue.length > 0 ? (
              <button 
                onClick={() => setSearchValue('')}
                className="text-secondary hover:scale-110 transition-transform p-0.5"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>
            ) : isOpen && (
               <button onClick={() => setIsOpen(false)} className="sm:hidden text-secondary/40">
                 <X className="h-4 w-4" />
               </button>
            )}

            {/* SEPARADOR FINO */}
            <div className="w-[1px] h-4 bg-slate-200" />

            {/* CONTADOR */}
            <span className="text-[10px] font-medium text-slate-400 tabular-nums min-w-[32px] text-right">
              {searchValue.length}/50
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}