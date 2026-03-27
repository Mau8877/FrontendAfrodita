import { useState, type ChangeEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, AlertCircle, Loader2, User, Phone } from 'lucide-react'
import { useCartStore } from '@/app/features/client/catalog/hooks'
import { ProductsCart, DeliverySummary } from '../components' 
import { useDeliveryStore } from '../store'
import { useCreatePedidoMutation } from '../store/pedidoApi' 
import { toast } from 'sonner'
import { type CreatePedidoRequest } from '../types' 

export function CartScreen() {
  const { items, clearCart } = useCartStore()
  const [createPedido, { isLoading: isCreating }] = useCreatePedidoMutation()
  
  // --- ESTADOS MANUALES PARA EL FORMULARIO ---
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefonoCliente, setTelefonoCliente] = useState('')

  const { rateData, method, coordinates, addressReference, resetDelivery } = useDeliveryStore() 
  
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)
  const shippingCost = method === 'delivery' ? (rateData?.costo_envio || 0) : 0
  const totalPrice = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0) + shippingCost

  // --- LÓGICA DE TELÉFONO (Solo números y max 8) ---
  const handleTelefonoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 8) {
      setTelefonoCliente(value)
    }
  }

  // --- VALIDACIÓN ACTUALIZADA ---
  const isCartEmpty = items.length === 0
  const isDeliveryInvalid = method === 'delivery' && (!coordinates || !rateData)
  
  // El botón se habilita solo si el nombre existe y el teléfono tiene exactamente 8 dígitos
  const isFormInvalid = !nombreCliente.trim() || telefonoCliente.length !== 8
  const isButtonDisabled = isCartEmpty || isDeliveryInvalid || isCreating || isFormInvalid

  const handleRealizarPedido = async () => {
    try {
      const payload: CreatePedidoRequest = {
        nombre_cliente: nombreCliente,
        items: items.map(item => ({ id: item.id, cantidad: item.cantidad })),
        entrega: {
          metodo: method,
          // Corrección TS: null no es permitido, enviamos undefined si es null
          id_tarifa: rateData?.id_tarifa ?? undefined, 
          latitud: coordinates?.lat,
          longitud: coordinates?.lng,
          referencia: addressReference || 'Sin referencia',
          costo_envio: shippingCost,
          distancia_km: rateData?.distancia_km || 0
        }
      }

      const response = await createPedido(payload).unwrap()

      if (response.success) {
        const nroTelefono = "59177060062";
        
        // 1. Formateo de productos (Estilo Factura)
        const listaProductos = items
          .map(i => `${i.cantidad} x -${i.nombre}- . Bs${i.precio * i.cantidad}`)
          .join('\n');

        // 2. Lógica Dinámica de Envío
        let textoEnvio = "";
        if (method === 'pickup') {
          textoEnvio = "Recojo en Tienda";
        } else if (rateData?.requiere_coordinacion || shippingCost === 0) {
          textoEnvio = "A otro Departamento / Provincia";
        } else if (coordinates) {
          textoEnvio = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
        }

        const seccionReferencia = addressReference.trim() 
          ? `\nReferencias: ${addressReference}` 
          : "";

        // 3. Construcción del mensaje final
        const mensajeRaw = 
          `Hola, quisiera hacer un pedido.\n\n` +
          `Quiero que me lo envíen a: ${textoEnvio}${seccionReferencia}\n\n` +
          `Nombre: ${nombreCliente}\n` +
          `Teléfono: ${telefonoCliente}\n\n` +
          `--------------------------------\n\n` +
          `${listaProductos}\n\n` +
          `--------------------------------\n\n` +
          `Total: ................... Bs${response.total}\n` +
          `--------------------------------\n\n` +
          `Código de pedido: ${response.codigo}`;

        window.open(`https://wa.me/${nroTelefono}?text=${encodeURIComponent(mensajeRaw)}`, '_blank');

        toast.success(`Pedido ${response.codigo} enviado`);
        
        // Limpieza total
        clearCart();
        resetDelivery();
        setNombreCliente('');
        setTelefonoCliente('');
      }
    } catch (error: unknown) {
      // Manejo de error tipado para evitar 'any'
      const errorData = error as { data?: { errors?: string } };
      console.error("❌ ERROR:", error);
      toast.error(errorData.data?.errors || "No se pudo generar el pedido");
    }
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans flex flex-col w-full">
      <header className="px-6 py-6 md:py-8 max-w-[1200px] mx-auto w-full flex items-center shrink-0 z-10">
        <Link to="/catalog" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mr-4 transition-transform hover:scale-105">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Mi Carrito</h1>
          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'} en total
          </p>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:gap-8 lg:px-6">
        <main className="w-full lg:flex-1 px-4 lg:px-0 pb-8 lg:pb-12 z-10">
           <ProductsCart />
        </main>

        <aside className="w-full lg:w-[400px] shrink-0 sticky bottom-0 lg:top-24 mt-auto lg:mt-0 bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] lg:shadow-sm lg:border lg:border-slate-100 p-6 pt-8 pb-8 md:pb-6 lg:p-8 z-50">
          <div className="w-full">
            
            <div className="mb-6 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Datos de Contacto</p>
              
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Nombre completo"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="tel"
                  inputMode="numeric"
                  placeholder="Teléfono (8 dígitos)"
                  value={telefonoCliente}
                  onChange={handleTelefonoChange}
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <DeliverySummary />
            </div>

            <div className="flex items-end justify-between mb-6 px-1">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total</span>
              <div className="flex flex-col items-end">
                {shippingCost > 0 && <span className="text-[9px] font-bold text-secondary uppercase mb-1">+ {shippingCost} Bs Envío</span>}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">{totalPrice.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-900 uppercase">Bs</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRealizarPedido}
              disabled={isButtonDisabled}
              className={`w-full h-14 rounded-xl font-black text-xs tracking-[0.2em] uppercase shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
                ${isButtonDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-secondary text-white shadow-secondary/20 hover:bg-[#5a2ab1]'}`}
            >
              {isCreating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isButtonDisabled && !isCartEmpty && <AlertCircle className="w-4 h-4" />}
                  Realizar Pedido
                </>
              )}
            </button>

            {isFormInvalid && !isCartEmpty && (
              <p className="text-[9px] text-center text-rose-500 font-bold uppercase mt-3">
                Ingresa tu nombre y 8 dígitos de teléfono
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}