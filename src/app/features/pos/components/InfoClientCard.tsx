import { User, MapPin, Truck, Store } from 'lucide-react'

interface InfoClienteCardProps {
  nombre: string
  onNombreChange: (val: string) => void
  metodoEntrega: string
  onMetodoChange: (val: string) => void
  referencia: string
  onReferenciaChange: (val: string) => void
}

export function InfoClientCard({
  nombre,
  onNombreChange,
  metodoEntrega,
  onMetodoChange,
  referencia,
  onReferenciaChange
}: InfoClienteCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
        <User className="w-4 h-4" />
        Datos del Cliente y Entrega
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Nombre */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Nombre / Razón Social</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Select Método de Entrega */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Método de Entrega</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {metodoEntrega === 'pickup' ? <Store className="w-4 h-4 text-slate-400" /> : <Truck className="w-4 h-4 text-slate-400" />}
            </div>
            <select
              value={metodoEntrega}
              onChange={(e) => onMetodoChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="pickup">Recojo en Tienda</option>
              <option value="delivery">Delivery / Envío</option>
            </select>
          </div>
        </div>

        {/* Input Referencia (Ocupa todo el ancho si es delivery) */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Referencia de Dirección
          </label>
          <input
            type="text"
            value={referencia}
            onChange={(e) => onReferenciaChange(e.target.value)}
            placeholder="Ej: Zona Sur, Calle 3, Puerta Negra..."
            disabled={metodoEntrega === 'pickup'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}