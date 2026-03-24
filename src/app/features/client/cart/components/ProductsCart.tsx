import { useNavigate } from '@tanstack/react-router'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/app/features/client/catalog/hooks' 
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ProductsCart() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const navigate = useNavigate()

  // --- ESTADO VACÍO ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-white shadow-sm border border-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-[11px] md:text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
          ¡Es hora de llenarlo de estilo!
        </p>
        <Button 
          onClick={() => navigate({ to: '/catalog' })}
          className="rounded-xl bg-secondary hover:bg-[#5a2ab1] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-lg shadow-secondary/20 transition-all active:scale-95"
        >
          Explorar Catálogo
        </Button>
      </div>
    )
  }

  // --- LISTA DE PRODUCTOS ---
  return (
    // w-full obliga al contenedor a estirarse
    <div className="flex flex-col gap-4 w-full">
      {items.map((item) => (
        <div 
          key={item.id} 
          onClick={() => navigate({
            to: '/catalog/product/$productId',
            params: { productId: String(item.id) }
          })}
          // w-full aquí también asegura que cada tarjeta ocupe toda la pantalla disponible en web
          className="relative flex items-center gap-4 bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-slate-50 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-100 transition-all group w-full"
        >
          
          {/* 1. IMAGEN */}
          <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:scale-[1.02] transition-transform">
            {item.imagen ? (
              <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-slate-300 uppercase tracking-widest">Sin foto</div>
            )}
          </div>

          {/* 2. INFORMACIÓN Y CONTROLES */}
          <div className="flex flex-col flex-1 h-24 md:h-28 justify-between">
            
            {/* Header: Título y SKU */}
            <div className="flex justify-between items-start w-full pr-8">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  SKU: {item.sku}
                </span>
                <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase leading-tight line-clamp-2 mt-0.5">
                  {item.nombre}
                </h3>
              </div>
            </div>

            {/* BOTÓN ELIMINAR AISLADO */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
                toast.info("Producto eliminado", { style: { fontFamily: 'Poppins' }});
              }}
              className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors z-10"
            >
              <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>

            {/* Footer: Precio y Cantidad */}
            <div className="flex items-end justify-between w-full">
              
              {/* Precio */}
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg md:text-xl font-black text-slate-900 leading-none">
                  {item.precio.toLocaleString()}
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-900 uppercase">Bs</span>
              </div>

              {/* Control de Cantidad Aislado */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-100 z-10"
              >
                <button 
                  onClick={() => {
                    if (item.cantidad > 1) {
                      updateQuantity(item.id, item.cantidad - 1);
                    } else {
                      removeItem(item.id);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 hover:text-secondary shadow-sm transition-all"
                >
                  <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
                
                <span className="w-8 text-center text-xs font-black text-slate-700">
                  {item.cantidad}
                </span>
                
                <button 
                  onClick={() => {
                    if (item.cantidad < item.stock_disponible) {
                      updateQuantity(item.id, item.cantidad + 1);
                    } else {
                      toast.error("Límite de stock alcanzado", {
                        description: `Solo tenemos ${item.stock_disponible} unidades disponibles.`,
                        style: { fontFamily: 'Poppins' }
                      });
                    }
                  }}
                  disabled={item.cantidad >= item.stock_disponible}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 hover:text-secondary shadow-sm transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  )
}