import { useParams } from '@tanstack/react-router'
// CAMBIO CLAVE: Importar desde el store del catálogo público, no del admin
import { useGetProductCatalogDetailQuery } from '@/app/features/client/catalog/store' 

export function CatalogProductDetailScreen() {
  // 1. Obtenemos el ID de la URL
  const { productId } = useParams({ from: '/_main/_client/catalog/product/$productId' })

  // 2. Consumimos el endpoint PÚBLICO (el que acabamos de crear en catalogApi)
  const { data, isLoading, error } = useGetProductCatalogDetailQuery(productId)

  // 3. Estados de carga y error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cargando producto...</span>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="text-rose-500 font-bold mb-2">No se pudo cargar el producto</div>
        <p className="text-xs text-slate-400">Es posible que el producto no tenga stock o no esté disponible.</p>
      </div>
    )
  }

  const product = data?.data

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">
        Vista Previa: {product?.nombre}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Visualización del JSON para debugging */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Respuesta del Servidor (JSON)</h3>
           <pre className="bg-slate-900 text-emerald-400 p-6 rounded-[2rem] overflow-auto text-[10px] max-h-[500px] shadow-2xl">
             {JSON.stringify(data, null, 2)}
           </pre>
        </div>

        {/* Datos Identificados */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6">
          <h3 className="text-[10px] font-black uppercase text-secondary tracking-widest">Información Extraída</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase">Nombre</span>
               <p className="font-black text-slate-800 uppercase">{product?.nombre}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase">SKU</span>
               <p className="font-mono text-xs font-bold text-slate-600">{product?.sku}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase">Precio</span>
               <p className="font-black text-xl text-slate-900">Bs. {product?.precio_venta}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase">Marca</span>
               <p className="font-black text-slate-800 uppercase">{product?.nombre_marca || 'Sin Marca'}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase">Categoría</span>
               <p className="font-black text-slate-800 uppercase">{product?.nombre_categoria || 'General'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
             <span className="text-[9px] font-bold text-slate-400 uppercase">Imágenes encontradas:</span>
             <div className="flex gap-2 mt-2">
                {product?.imagenes.map((img, i) => (
                  <img key={i} src={img.imagen} className="w-20 h-20 object-cover rounded-2xl border border-slate-100" />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}