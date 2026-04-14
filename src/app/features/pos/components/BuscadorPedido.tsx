import { useState } from 'react'
import { Search, Loader2, ArrowRight } from 'lucide-react'

interface BuscadorPedidoProps {
  onSearch: (codigo: string) => void
  isLoading: boolean
}

export function BuscadorPedido({ onSearch, isLoading }: BuscadorPedidoProps) {
  const [codigo, setCodigo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (codigo.trim()) {
      onSearch(codigo.trim().toUpperCase())
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Buscar Pedido de WhatsApp</h2>
        <p className="text-sm text-slate-500">Ingresa el código corto para cargar los datos automáticamente.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: K4SV"
            maxLength={10}
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold uppercase tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!codigo.trim() || isLoading}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Buscando...
            </>
          ) : (
            <>
              Cargar Datos
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}