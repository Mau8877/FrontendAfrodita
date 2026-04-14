import { Trash2, Plus, Minus, PackageOpen } from 'lucide-react'

// El tipo local para manejar los datos en la tabla (lo adaptaremos del schema)
export interface ProductoVentaItem {
  id_producto: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface TablaProductosVentaProps {
  items: ProductoVentaItem[];
  onUpdateCantidad: (index: number, nuevaCantidad: number) => void;
  onUpdatePrecio: (index: number, nuevoPrecio: number) => void;
  onRemoveItem: (index: number) => void;
}

export function TablaProductosVenta({
  items,
  onUpdateCantidad,
  onUpdatePrecio,
  onRemoveItem
}: TablaProductosVentaProps) {
  
  if (items.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
        <PackageOpen className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No hay productos en la venta.</p>
        <p className="text-xs text-slate-400 mt-1">Busca un pedido o agrega productos manualmente.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500 tracking-wider">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4 text-center">Cantidad</th>
              <th className="px-6 py-4 text-right">Precio Un. (Bs)</th>
              <th className="px-6 py-4 text-right">Subtotal</th>
              <th className="px-6 py-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr key={item.id_producto} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.nombre}
                </td>
                
                {/* Control de Cantidad */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onUpdateCantidad(index, Math.max(1, item.cantidad - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{item.cantidad}</span>
                    <button 
                      onClick={() => onUpdateCantidad(index, item.cantidad + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>

                {/* Control de Precio (Editable para descuentos) */}
                <td className="px-6 py-4 text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.precio_unitario}
                    onChange={(e) => onUpdatePrecio(index, parseFloat(e.target.value) || 0)}
                    className="w-24 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </td>

                {/* Subtotal Calculado */}
                <td className="px-6 py-4 text-right font-black text-slate-900">
                  {item.subtotal.toFixed(2)}
                </td>

                {/* Eliminar */}
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onRemoveItem(index)}
                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}