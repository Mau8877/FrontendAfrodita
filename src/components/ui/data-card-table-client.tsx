import { useState } from "react"
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { type Product } from "@/app/features/catalog"

interface ProductClientCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
}

export function ProductClientCard({ product, onQuickView, onAddToCart }: ProductClientCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const imagenes = product.imagenes || []
  
  // Navegación de imágenes
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImgIndex((prev) => (prev + 1) % imagenes.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImgIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(247,209,208,0.3)] border border-slate-50 flex flex-col h-full">
      
      {/* CONTENEDOR DE IMAGEN CON CARRUSEL */}
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-50">
        {imagenes.length > 0 ? (
          <img 
            src={imagenes[currentImgIndex]?.imagen} 
            alt={product.nombre} 
            className="h-full w-full object-cover transition-all duration-700"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase">Sin imagen</div>
        )}

        {/* CONTROLES DEL CARRUSEL (Solo si hay más de una imagen) */}
        {imagenes.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="icon" variant="ghost" onClick={prevImage}
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" variant="ghost" onClick={nextImage}
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* INDICADOR DE FOTOS (Puntitos) */}
        {imagenes.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imagenes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-4 bg-secondary' : 'w-1 bg-white/60'}`} 
              />
            ))}
          </div>
        )}

        {/* ETIQUETA DE MARCA */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-secondary shadow-sm">
            {product.nombre_marca || 'Afrodita'}
          </span>
        </div>
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="mt-5 flex flex-col flex-grow space-y-1 px-1">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-1 italic">
          {product.nombre}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {product.nombre_categoria}
        </p>
        
        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-secondary uppercase tracking-tighter leading-none">Precio</span>
            <span className="text-xl font-black text-slate-900 leading-none mt-1">
              {product.precio_venta} <small className="text-[10px] ml-0.5">Bs</small>
            </span>
          </div>

          {/* BOTONES DE ACCIÓN LADO A LADO */}
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => onQuickView?.(product)}
              className="h-10 w-10 rounded-2xl border-slate-100 text-slate-400 hover:text-secondary hover:border-secondary transition-all active:scale-90"
            >
              <Eye className="h-5 w-5" />
            </Button>

            <Button 
              size="icon" 
              onClick={() => onAddToCart?.(product)}
              className="h-10 w-10 rounded-2xl bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20 active:scale-90 transition-all"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}