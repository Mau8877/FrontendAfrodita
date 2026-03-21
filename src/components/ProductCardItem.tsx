/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react'
import { 
  Tag, Eye, EyeOff, ChevronLeft, ChevronRight, Pencil, Trash2, CheckCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { type Product } from '@/app/features/catalog/products/types'
import { useUpdateProductMutation } from '@/app/features/catalog/products/store/productApi'

interface ProductCardItemProps {
  product: Product
  onEdit?: (p: Product) => void
  onDelete?: (p: Product) => void
  showVisibilityToggle?: boolean 
}

const ProductActions = ({ 
  product, onEdit, onDelete, showVisibilityToggle = true
}: { 
  product: Product, 
  onEdit?: (p: Product) => void, 
  onDelete?: (p: Product) => void,
  showVisibilityToggle?: boolean
}) => {
  const [updateProduct, { isLoading }] = useUpdateProductMutation()

  if (!showVisibilityToggle && !onEdit && !onDelete) return null;

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextStatus = !product.is_visible
    const formData = new FormData()
    formData.append('is_visible', String(nextStatus))
    
    try {
      await updateProduct({ 
        id: product.id, 
        body: formData
      }).unwrap()
      
      toast.success(`Producto ${nextStatus ? 'visible' : 'oculto'}`, {
        icon: nextStatus ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-rose-500" />
      })
    } catch {
      toast.error("Error al actualizar visibilidad")
    }
  }

  return (
    <div className="flex items-center justify-around w-full mt-auto pt-4 border-t border-slate-100/60">
      {showVisibilityToggle && (
        <Button 
          variant="ghost" size="icon" 
          disabled={isLoading}
          className={`h-10 w-10 rounded-2xl transition-all duration-300 ${
            !product.is_visible 
            ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
            : 'text-slate-300 hover:text-rose-400 hover:bg-rose-50/50'
          }`}
          onClick={handleToggleVisibility}
        >
          {product.is_visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </Button>
      )}

      {onEdit && (
        <Button 
            variant="ghost" size="icon" 
            className="h-10 w-10 rounded-2xl text-slate-300 hover:text-sky-500 hover:bg-sky-50"
            onClick={(e) => { e.stopPropagation(); onEdit?.(product) }}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      )}

      {onDelete && (
        <Button 
            variant="ghost" size="icon" 
            className="h-10 w-10 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDelete?.(product) }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

export const ProductCardItem = ({ product, onEdit, onDelete, showVisibilityToggle }: ProductCardItemProps) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const isDeleted = !!product.deleted_at;

  const handleMouseEnter = () => { if (timerRef.current) clearTimeout(timerRef.current) }
  
  const handleMouseLeave = () => {
    if (currentImgIndex !== 0) {
      timerRef.current = setTimeout(() => setCurrentImgIndex(0), 5000)
    }
  }

  useEffect(() => { 
    return () => { if (timerRef.current) clearTimeout(timerRef.current) } 
  }, [])

  return (
    <div 
      className={`group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full ${isDeleted ? 'bg-slate-50/30' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48 bg-slate-50/40 flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {isDeleted ? (
            <div className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm" title="En Papelera">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="h-7 w-7 rounded-full bg-emerald-500/90 backdrop-blur-md flex items-center justify-center text-white border border-emerald-400 shadow-md shadow-emerald-200" title="Activo">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <img 
          src={product.imagenes[currentImgIndex]?.imagen} 
          className={`max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-700 group-hover:scale-105 ${isDeleted ? 'opacity-40 grayscale' : ''}`} 
          alt={product.nombre}
        />
        
        {product.imagenes.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/80 shadow-sm text-slate-400" onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev - 1 + product.imagenes.length) % product.imagenes.length) }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/80 shadow-sm text-slate-400" onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev + 1) % product.imagenes.length) }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-secondary/95 text-white px-3 py-1 rounded-xl text-[11px] font-bold shadow-lg shadow-emerald-200/40 tracking-wide">
          Bs. {product.precio_venta}
        </div>

        {/* CAMBIO 1: Solo mostrar si existe nombre_marca */}
        {product.nombre_marca && (
          <div className="absolute top-4 left-4">
             <span className="bg-white/80 backdrop-blur pl-1.5 pr-3 py-1 rounded-full text-[9px] font-black uppercase text-primary border border-primary/5 shadow-sm flex items-center gap-1.5">
               <Tag className="w-2.5 h-2.5 text-primary/40" />
               {product.nombre_marca}
             </span>
          </div>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {product.imagenes.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === currentImgIndex ? 'w-3 bg-secondary' : 'w-1 bg-secondary/40'}`} />
          ))}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          {/* CAMBIO 2: Renderizado condicional del tipo, separador y categoría */}
          <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-1">
            {product.nombre_tipo} 
            {product.nombre_tipo && product.nombre_categoria && <span className="mx-1 opacity-50">/</span>} 
            {product.nombre_categoria}
          </p>
          <h3 className={`text-[13px] font-black uppercase leading-tight line-clamp-1 ${isDeleted ? 'text-slate-300' : 'text-slate-800'}`}>
            {product.nombre}
          </h3>
          <p className="mt-1.5 text-[10px] font-medium text-slate-400 leading-relaxed line-clamp-2 italic">
            {product.descripcion || "Sin descripción"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto mb-2">
          <div className="flex -space-x-1.5">
            {product.colores.map(c => (
              <div key={c.id} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.codigo_hex }} title={c.nombre} />
            ))}
          </div>
          <span className="text-[9px] font-mono font-black text-primary/40 bg-primary/5 px-2 py-0.5 rounded-lg">
            {product.sku}
          </span>
        </div>

        <ProductActions 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          showVisibilityToggle={showVisibilityToggle} 
        />
      </div>
    </div>
  )
}