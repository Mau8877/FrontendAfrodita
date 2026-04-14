import { Store, CreditCard, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

// Definimos interfaces básicas para los datos que vienen del RTK Query
interface SimpleItem {
  id: string;
  nombre: string;
}

interface MetodoPagoItem extends SimpleItem {
  tipo?: string;
}

interface CheckoutPanelProps {
  sucursales: SimpleItem[];
  metodosPago: MetodoPagoItem[];
  
  // Estados del formulario
  selectedSucursal: string;
  onSucursalChange: (val: string) => void;
  selectedMetodo: string;
  onMetodoChange: (val: string) => void;
  observaciones: string;
  onObservacionesChange: (val: string) => void;
  
  // Totales
  subtotal: number;
  envio: number;
  total: number;
  
  // Acciones y Estado
  onSubmit: () => void;
  isLoading: boolean;
  isValid: boolean; // Para saber si ya hay productos y campos llenos
}

export function CheckoutPanel({
  sucursales,
  metodosPago,
  selectedSucursal,
  onSucursalChange,
  selectedMetodo,
  onMetodoChange,
  observaciones,
  onObservacionesChange,
  subtotal,
  envio,
  total,
  onSubmit,
  isLoading,
  isValid
}: CheckoutPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        
        {/* --- SUCURSAL --- */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Store className="w-4 h-4" />
            Sucursal de Salida
          </label>
          <select
            value={selectedSucursal}
            onChange={(e) => onSucursalChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="" disabled>Seleccione una sucursal...</option>
            {sucursales.map(sucursal => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* --- MÉTODO DE PAGO --- */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Método de Pago
          </label>
          <div className="grid grid-cols-2 gap-2">
            {metodosPago.map((metodo) => (
              <button
                key={metodo.id}
                type="button"
                onClick={() => onMetodoChange(metodo.id)}
                className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1
                  ${selectedMetodo === metodo.id 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500/20' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <span>{metodo.nombre}</span>
                <span className="text-[9px] font-medium opacity-70 uppercase tracking-wider">{metodo.tipo}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- OBSERVACIONES (EL NUEVO CAMPO) --- */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Notas / Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => onObservacionesChange(e.target.value)}
            placeholder="Añade notas internas de la venta..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

      </div>

      {/* --- ZONA DE TOTALES Y BOTÓN (Pegado al fondo) --- */}
      <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
        
        {/* Desglose */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Subtotal Productos</span>
            <span>Bs. {subtotal.toFixed(2)}</span>
          </div>
          {envio > 0 && (
            <div className="flex justify-between text-blue-600 font-medium">
              <span>Costo de Envío</span>
              <span>+ Bs. {envio.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-end pt-3 pb-1">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total a Cobrar</span>
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-sm font-bold uppercase">Bs.</span>
              <span className="text-4xl font-black tracking-tight leading-none">
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de Confirmación */}
        <button
          onClick={onSubmit}
          disabled={!isValid || isLoading || total === 0}
          className={`w-full h-14 rounded-xl font-black text-[13px] tracking-[0.15em] uppercase shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
            ${(!isValid || total === 0) 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
            }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {(!isValid || total === 0) ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              Confirmar Venta
            </>
          )}
        </button>
      </div>
    </div>
  )
}