import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Plus,
  PackageOpen,
  Search,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { useLazyGetProductsSimpleQuery } from "../"; // Ajusta a tu ruta de productsApi

// El tipo local para manejar los datos
export interface ProductoVentaItem {
  id_producto: string;
  nombre: string;
  cantidad: number;
  precio_final: number;
  subtotal: number;
}

interface TablaProductosVentaProps {
  items: ProductoVentaItem[];
  onAddItem: () => void;
  onUpdateProducto: (
    index: number,
    id_producto: string,
    nombre: string,
  ) => void;
  onUpdateCantidad: (index: number, nuevaCantidad: number) => void;
  onUpdatePrecio: (index: number, nuevoPrecio: number) => void;
  onRemoveItem: (index: number) => void;
}

const hideSpinnersClass =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

// ============================================================================
// COMPONENTES NINJA: Inputs de Texto que simulan ser Números Perfectos
// ============================================================================

function CantidadInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  // Estado local como TEXTO para poder manipular los ceros libremente
  const [localVal, setLocalVal] = useState(value === 0 ? "" : value.toString());

  // Si el valor externo cambia (por ejemplo, al limpiar el carrito), sincronizamos
  useEffect(() => {
    if (value !== parseInt(localVal || "0", 10)) {
      setLocalVal(value === 0 ? "" : value.toString());
    }
  }, [value, localVal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9]/g, ""); // 1. Matamos letras o símbolos
    v = v.replace(/^0+(?=\d)/, ""); // 2. Matamos ceros a la izquierda SI hay más dígitos

    setLocalVal(v);
    onChange(v === "" ? 0 : parseInt(v, 10));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={localVal}
      onChange={handleChange}
      className={`w-full text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${hideSpinnersClass}`}
      placeholder="0"
    />
  );
}

function PrecioInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [localVal, setLocalVal] = useState(value === 0 ? "" : value.toString());

  useEffect(() => {
    if (value !== parseFloat(localVal || "0")) {
      setLocalVal(value === 0 ? "" : value.toString());
    }
  }, [value, localVal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9.]/g, ""); // 1. Matamos todo menos números y puntos

    // 2. Evitamos que pongan dos puntos (ej: 10.5.2 -> 10.52)
    const parts = v.split(".");
    if (parts.length > 2) {
      v = parts[0] + "." + parts.slice(1).join("");
    }

    // 3. Matamos el cero a la izquierda SOLO si no hay un punto después (Permite 0.5, pero 012 -> 12)
    if (v.length > 1 && v.startsWith("0") && v[1] !== ".") {
      v = v.replace(/^0+/, "");
      if (v.startsWith(".")) v = "0" + v;
    }

    setLocalVal(v);
    onChange(v === "" || v === "." ? 0 : parseFloat(v));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={localVal}
      onChange={handleChange}
      className={`w-full text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${hideSpinnersClass}`}
      placeholder="0.00"
    />
  );
}

// ============================================================================
// SUBCOMPONENTE: FILA INDIVIDUAL
// ============================================================================
function ProductoRow({
  item,
  index,
  selectedProductIds,
  onUpdateProducto,
  onUpdateCantidad,
  onUpdatePrecio,
  onRemoveItem,
}: {
  item: ProductoVentaItem;
  index: number;
  selectedProductIds: string[];
  onUpdateProducto: (index: number, id: string, nombre: string) => void;
  onUpdateCantidad: (index: number, cant: number) => void;
  onUpdatePrecio: (index: number, precio: number) => void;
  onRemoveItem: (index: number) => void;
}) {
  const [triggerSearch, { data: searchResults, isFetching }] =
    useLazyGetProductsSimpleQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce para la búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        triggerSearch({ search: searchTerm });
        setIsSearchOpen(true);
      } else {
        setIsSearchOpen(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, triggerSearch]);

  // Cerrar buscador si hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FILTRO FRONTEND: A prueba de balas
  const resultadosFiltrados =
    searchResults?.data?.filter((prod) =>
      prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100 last:border-0 relative">
      {/* 1. COLUMNA: PRODUCTO (BUSCADOR COMPACTO) */}
      <td className="px-4 py-3 w-[45%] min-w-[200px] max-w-[350px]">
        {item.id_producto ? (
          <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 w-full">
            <div className="flex items-center gap-2 overflow-hidden">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 truncate">
                {item.nombre}
              </span>
            </div>
            <button
              onClick={() => {
                onUpdateProducto(index, "", "");
                setSearchTerm("");
              }}
              className="text-blue-400 hover:text-rose-500 transition-colors p-1 flex-shrink-0"
              title="Cambiar producto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative w-full" ref={searchContainerRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isFetching ? (
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />

            {/* Resultados del Buscador */}
            {isSearchOpen && (
              <div className="absolute z-[100] w-full min-w-[250px] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto left-0">
                {!isFetching && resultadosFiltrados.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 text-center">
                    No se encontraron productos
                  </div>
                ) : (
                  resultadosFiltrados.map((prod) => {
                    const isAlreadyAdded = selectedProductIds.includes(prod.id);

                    return (
                      <button
                        key={prod.id}
                        disabled={isAlreadyAdded}
                        onClick={() => {
                          onUpdateProducto(index, prod.id, prod.nombre);
                          setIsSearchOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between ${
                          isAlreadyAdded
                            ? "bg-slate-50 opacity-50 cursor-not-allowed"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-sm font-bold text-slate-800 truncate pr-2">
                          {prod.nombre}
                        </div>
                        {isAlreadyAdded && (
                          <span className="text-[9px] uppercase tracking-wider font-black text-rose-500 bg-rose-100 px-2 py-0.5 rounded-md flex-shrink-0">
                            Ya agregado
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </td>

      {/* 2. COLUMNA: CANTIDAD (USANDO EL NINJA COMPONENT) */}
      <td className="px-4 py-3 w-28">
        <CantidadInput
          value={item.cantidad}
          onChange={(val) => onUpdateCantidad(index, val)}
        />
      </td>

      {/* 3. COLUMNA: PRECIO UNITARIO (USANDO EL NINJA COMPONENT) */}
      <td className="px-4 py-3 w-32 text-right">
        <PrecioInput
          value={item.precio_final}
          onChange={(val) => onUpdatePrecio(index, val)}
        />
      </td>

      {/* 4. COLUMNA: SUBTOTAL */}
      <td className="px-4 py-3 w-32 text-right font-black text-slate-900">
        {(item.subtotal || 0).toFixed(2)}
      </td>

      {/* 5. COLUMNA: ACCIÓN (ELIMINAR) */}
      <td className="px-4 py-3 w-16 text-center">
        <button
          onClick={() => onRemoveItem(index)}
          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors opacity-50 group-hover:opacity-100"
          title="Eliminar fila"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL: TABLA
// ============================================================================
export function TablaProductosVenta({
  items,
  onAddItem,
  onUpdateProducto,
  onUpdateCantidad,
  onUpdatePrecio,
  onRemoveItem,
}: TablaProductosVentaProps) {
  // Extraemos todos los IDs que ya están seleccionados en la tabla
  const selectedProductIds = items
    .map((item) => item.id_producto)
    .filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between p-4 md:px-6 border-b border-slate-100">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          Detalle de Productos
        </h3>
        <button
          type="button"
          onClick={onAddItem}
          className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      <div className="w-full overflow-x-auto sm:overflow-visible custom-scrollbar pb-36 min-h-[300px]">
        <table className="w-full text-left text-sm min-w-[650px]">
          <thead className="bg-slate-50/50 text-[11px] uppercase font-black text-slate-400 tracking-wider">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3 text-center">Cant.</th>
              <th className="px-4 py-3 text-right">Precio (Bs)</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
              <th className="px-4 py-3 text-center"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <PackageOpen className="w-10 h-10 text-slate-200 mb-2" />
                    <p className="text-slate-500 text-sm font-medium">
                      La tabla está vacía
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Haz clic en "Agregar Producto" para comenzar
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <ProductoRow
                  key={index}
                  item={item}
                  index={index}
                  selectedProductIds={selectedProductIds}
                  onUpdateProducto={onUpdateProducto}
                  onUpdateCantidad={onUpdateCantidad}
                  onUpdatePrecio={onUpdatePrecio}
                  onRemoveItem={onRemoveItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
