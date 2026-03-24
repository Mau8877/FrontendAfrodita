import { useState, useEffect } from 'react'
import { MapPin, Store, Navigation, Loader2, ChevronDown } from 'lucide-react'
import { useDeliveryStore, useCalculateDeliveryRateMutation } from '../store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { MapPicker } from './MapPicker'

export function DeliverySummary() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    method, setMethod, 
    rateData, setRateData, 
    coordinates, setCoordinates,
    addressReference, setAddressReference 
  } = useDeliveryStore()

  const [calculateRate, { isLoading: isCalculating }] = useCalculateDeliveryRateMutation()

  // Determinar si falta configurar para la alerta visual
  const isFirstTime = !rateData && method === 'delivery'

  const updateRate = async (lat: number, lng: number) => {
    try {
      const response = await calculateRate({ latitud: lat, longitud: lng }).unwrap()
      if (response.success) {
        setRateData(response.data)
      }
    } catch {
      toast.error("Error al calcular la tarifa")
    }
  }

  useEffect(() => {
    if (method === 'delivery' && coordinates?.lat && coordinates?.lng) {
      updateRate(coordinates.lat, coordinates.lng)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates?.lat, coordinates?.lng, method])

  const handleGetLocation = () => {
    if (!navigator.geolocation) return toast.error("GPS no soportado")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates(position.coords.latitude, position.coords.longitude)
      },
      () => toast.error("Permisos de GPS denegados")
    )
  }

  return (
    <div className={`w-full rounded-3xl border transition-all duration-300 ${isOpen ? 'bg-white shadow-lg border-slate-200' : 'bg-slate-50/50 border-slate-100'}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        
        {/* --- HEADER (TODA ESTA ÁREA ABRE/CIERRA) --- */}
        <CollapsibleTrigger asChild>
          <div className="relative flex items-center justify-between p-4 cursor-pointer select-none">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${isOpen ? 'bg-secondary text-white' : 'bg-white text-secondary'}`}>
                {method === 'pickup' ? <Store className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Entrega
                </p>
                <h4 className={`text-xs font-black uppercase transition-colors ${isFirstTime && !isOpen ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                  {rateData 
                    ? `${rateData.mensaje} (${rateData.distancia_km} km)` 
                    : (method === 'pickup' ? 'Recojo en Tienda' : 'Definir Método de Entrega')
                  }
                </h4>
              </div>
            </div>

            {/* AQUÍ ESTÁ EL BOTÓN QUE ME DIBUJASTE */}
            <div className={`p-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-6 h-6 text-slate-300" />
            </div>
          </div>
        </CollapsibleTrigger>

        {/* --- CONTENIDO --- */}
        <CollapsibleContent className="px-4 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-5 pt-5 border-t border-slate-100">
            
            {/* SELECTOR DE MÉTODO */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMethod('pickup')}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${method === 'pickup' ? 'border-secondary bg-secondary/5' : 'border-transparent bg-slate-50'}`}
              >
                <Store className={`w-6 h-6 ${method === 'pickup' ? 'text-secondary' : 'text-slate-300'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">Recojo en Tienda</span>
              </button>
              
              <button
                onClick={() => setMethod('delivery')}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${method === 'delivery' ? 'border-secondary bg-secondary/5' : 'border-transparent bg-slate-50'}`}
              >
                <Navigation className={`w-6 h-6 ${method === 'delivery' ? 'text-secondary' : 'text-slate-300'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">Delivery</span>
              </button>
            </div>

            {/* OPCIONES DE DELIVERY */}
            {method === 'delivery' && (
              <div className="flex flex-col gap-4">
                <MapPicker />
                
                <Button 
                  onClick={handleGetLocation} 
                  disabled={isCalculating} 
                  variant="outline" 
                  className="bg-white rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 border-slate-200"
                >
                  {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  Fijar mi GPS Actual
                </Button>

                <textarea
                  placeholder="Referencia opcional..."
                  value={addressReference}
                  onChange={(e) => setAddressReference(e.target.value)}
                  className="w-full min-h-[70px] p-4 rounded-2xl border border-slate-200 bg-white text-xs font-medium outline-none transition-all resize-none focus:border-secondary"
                />

                {/* RESULTADO DE TARIFA */}
                {!isCalculating && rateData && (
                  <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${rateData.requiere_coordinacion ? 'bg-amber-50 border-amber-200' : 'bg-secondary/10 border-secondary/20'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${rateData.requiere_coordinacion ? 'text-amber-600' : 'text-secondary'}`}>
                        {rateData.requiere_coordinacion ? 'Atención:' : 'Logística:'}
                      </span>
                      <span className={`text-xs font-black ${rateData.requiere_coordinacion ? 'text-amber-700' : 'text-secondary'}`}>
                        {rateData.distancia_km} KM
                      </span>
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-tight ${rateData.requiere_coordinacion ? 'text-amber-700' : 'text-secondary'}`}>
                      {rateData.mensaje}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}