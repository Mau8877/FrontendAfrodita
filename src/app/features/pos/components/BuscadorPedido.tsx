import { useState } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";

interface BuscadorPedidoProps {
  onSearch: (codigo: string) => void;
  isLoading: boolean;
}

export function BuscadorPedido({ onSearch, isLoading }: BuscadorPedidoProps) {
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim()) {
      onSearch(codigo.trim().toUpperCase());
    }
  };

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-sm font-bold text-slate-900">Buscar Pedido</h2>
        <p className="text-xs text-slate-500">
          Ingresa el código de pedido para cargar los datos automáticamente.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full max-w-md"
      >
        {/* Icono de búsqueda a la izquierda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="Ej: K4SV"
          maxLength={4}
          className="block w-full pl-9 pr-28 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold uppercase tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          disabled={isLoading}
        />

        {/* Botón interior alineado a la derecha */}
        <button
          type="submit"
          disabled={!codigo.trim() || isLoading}
          className="absolute right-1 top-1 bottom-1 inline-flex items-center justify-center px-3 rounded-md font-bold text-xs text-white bg-secondary/85 hover:bg-secondary focus:outline-none disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5" />
              Buscando
            </>
          ) : (
            <>
              Cargar
              <ArrowRight className="ml-1 h-3.5 w-3.5 " />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
