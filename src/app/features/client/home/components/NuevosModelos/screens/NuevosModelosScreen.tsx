import { useGetNewModelsQuery } from "../store/newModelsApi"
import { ProductClientCard } from "@/components/ui/data-card-table-client"
import { DataCardTable } from "@/components/ui/data-card-table"
import { Link } from "@tanstack/react-router"
import { Sparkles } from "lucide-react"

export function NuevosModelosScreen() {
  const { data, isFetching, refetch } = useGetNewModelsQuery()
  const productos = data?.data || []

  return (
    // Quitamos border-b y py-20 para reducir espacios
    <section className="py-12 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        
        {/* ENCABEZADO CENTRADO EN MÓVIL */}
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

        {/* GRID SIN STYLE TAG: Usamos un contenedor que fuerza el grid 2x2 en móvil */}
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
      </div>
    </section>
  )
}