import { useState, useEffect } from "react"
import { ShoppingCart, Eye, ChevronLeft, ChevronRight, Tag } from "lucide-react"
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
  
  // 1. Lógica de reseteo automático de imagen (10 segundos)
  useEffect(() => {
    if (currentImgIndex !== 0) {
      const timer = setTimeout(() => {
        setCurrentImgIndex(0)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [currentImgIndex])

  // 2. Formateo de precio (Quita decimales si es .00)
  const formattedPrice = Number(product.precio_venta) % 1 === 0 
    ? Math.floor(Number(product.precio_venta)) 
    : product.precio_venta;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImgIndex((prev) => (prev + 1) % imagenes.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImgIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  return (
    <div className="group relative bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-2 md:p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(247,209,208,0.3)] border border-slate-50 flex flex-col h-full">
      
      {/* --- SECCIÓN 1: IMAGEN --- */}
      <div className="relative aspect-square overflow-hidden rounded-[1.2rem] md:rounded-[2rem] bg-slate-50 border border-slate-100">
        {imagenes.length > 0 ? (
          <img 
            src={imagenes[currentImgIndex]?.imagen} 
            alt={product.nombre} 
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase">Sin imagen</div>
        )}

        {/* Badge de Marca con Icono */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
          <span className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 md:px-3 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest text-secondary shadow-sm border border-secondary/10">
            <Tag className="w-2.5 h-2.5 md:w-3 md:h-3 text-secondary" />
            {product.nombre_marca || 'Afrodita'}
          </span>
        </div>

        {/* Controles de Navegación: Sutilmente visibles en móvil, hover en web */}
        {imagenes.length > 1 && (
          <div className="absolute inset-x-1 md:inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="ghost" onClick={prevImage} className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 text-slate-700" />
            </Button>
            <Button size="icon" variant="ghost" onClick={nextImage} className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-slate-700" />
            </Button>
          </div>
        )}

        {/* Indicadores de fotos (Dots) */}
        {imagenes.length > 1 && (
          <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {imagenes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-0.5 md:h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-3 md:w-4 bg-secondary' : 'w-1 bg-white/60'}`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* --- SECCIÓN 2: INFORMACIÓN --- */}
      <div className="mt-3 md:mt-5 flex flex-col flex-grow px-1">
        
        {/* Categoría Breadcrumb */}
        <div className="flex items-center gap-1 overflow-hidden mb-1">
          <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter shrink-0">{product.nombre_tipo}</span>
          <span className="text-[7px] md:text-[9px] text-slate-300 shrink-0">/</span>
          <span className="text-[7px] md:text-[9px] font-black text-secondary/60 uppercase tracking-tighter truncate">{product.nombre_categoria}</span>
        </div>

        {/* Título: Altura fija de 2 líneas para alineación perfecta */}
        <h3 className="text-[11px] md:text-base font-black text-slate-800 uppercase tracking-tight line-clamp-2 leading-tight md:leading-[1.25rem] h-[1.8rem] md:h-[2.5rem] overflow-hidden">
          {product.nombre}
        </h3>

        {/* Descripción: Pegada al título */}
        <p className="text-[8px] md:text-[10px] font-medium text-slate-400 italic leading-snug line-clamp-1 mt-0.5">
          {product.descripcion}
        </p>

        {/* Colores y SKU */}
        <div className="flex items-center justify-between mt-3 md:mt-4 mb-1 md:mb-2">
          <div className="flex -space-x-1.5 md:-space-x-2">
            {product.colores?.slice(0, 3).map((color) => (
              <div 
                key={color.id} 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color.codigo_hex }}
              />
            ))}
          </div>

          <div className="bg-secondary/10 px-1.5 md:px-2 h-4 md:h-5 flex items-center justify-center rounded-md border border-secondary/20">
            <span className="text-[7px] md:text-[8px] font-mono font-bold text-secondary uppercase tracking-tighter leading-none">
              {product.sku}
            </span>
          </div>
        </div>
        
        {/* --- SECCIÓN 3: FOOTER (Precio y Botones) --- */}
        <div className="flex items-center justify-between pt-2 md:pt-3 mt-auto border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Precio</span>
            <div className="flex items-baseline gap-0.5 md:gap-1 mt-1">
              <span className="text-sm md:text-xl font-black text-slate-900 leading-none">
                {formattedPrice}
              </span>
              <span className="text-[8px] md:text-[10px] font-bold text-slate-900 uppercase">Bs</span>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              size="icon" variant="outline" onClick={() => onQuickView?.(product)}
              className="h-7 w-7 md:h-9 md:w-9 rounded-lg md:rounded-xl border-slate-100 text-slate-400 hover:text-secondary hover:border-secondary transition-all"
            >
              <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
            <Button 
              size="icon" onClick={() => onAddToCart?.(product)}
              className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20 active:scale-95 transition-all"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}