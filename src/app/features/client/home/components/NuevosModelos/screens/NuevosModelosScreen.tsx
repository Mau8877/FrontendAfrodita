import { useGetNewModelsQuery } from "../store/newModelsApi"
import { ProductClientCard } from "@/components/ui/data-card-table-client"
import { Link } from "@tanstack/react-router"
import { ImageIcon } from "lucide-react"

export function NuevosModelosScreen() {
  const { data, isFetching } = useGetNewModelsQuery()
  const productos = data?.data || []

  return (
    <section className="py-12 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-center md:text-left items-center md:items-end">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-secondary">
                Lanzamientos
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
              Nuevos Modelos
            </h2>
          </div>
          
          <Link 
            to="/catalog" 
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-secondary transition-all"
          >
            Ver catálogo completo
            <span className="hidden md:block h-[1px] w-6 bg-slate-200 group-hover:bg-secondary group-hover:w-10 transition-all" />
          </Link>
        </div>

        {/* LÓGICA DE RENDERIZADO */}
        {isFetching ? (
          /* SKELETON / LOADING STATE */
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : productos.length > 0 ? (
          /* GRID DE PRODUCTOS */
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {productos.map((product) => (
              <ProductClientCard 
                key={product.id}
                product={product} 
                onAddToCart={(p) => console.log("Carrito:", p.nombre)}
                onQuickView={(p) => console.log("Detalle:", p.id)}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE: No hay productos */
          <div className="w-full py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-200">
            <div className="p-4 rounded-full bg-white shadow-sm mb-4">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center px-6">
              No hay productos disponibles en el catálogo por el momento, vuelva más tarde
            </p>
          </div>
        )}
      </div>
    </section>
  )
}