import { useGetNewModelsQuery } from "../store/newModelsApi"
import { ProductClientCard } from "@/components/ui/data-card-table-client"
import { DataCardTable } from "@/components/ui/data-card-table"
import { Link } from "@tanstack/react-router"
import { Sparkles } from "lucide-react"

export function NuevosModelosScreen() {
  const { data, isFetching, refetch } = useGetNewModelsQuery()
  const productos = data?.data || []

  return (
    <section className="py-24 bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">
                Lanzamientos
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
              Nuevos Modelos
            </h2>
          </div>
          
          <Link 
            to="/catalog" 
            className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-secondary transition-all"
          >
            Explorar todo 
            <span className="h-[1px] w-8 bg-slate-200 group-hover:bg-secondary group-hover:w-12 transition-all" />
          </Link>
        </div>

        {/* DISTRIBUCIÓN HORIZONTAL */}
        {/* Forzamos el grid a 3 columnas exactas en desktop para que se distribuyan en todo el ancho */}
        <div className="w-full">
          <DataCardTable
            data={productos}
            columns={[]} 
            isFetching={isFetching}
            onRefresh={refetch}
            hideSearch={true}
            hideToolbar={true}
            hidePagination={true}
            // Personalizamos las clases del grid interno mediante el renderCard o ajustando el contenedor
            renderCard={(product) => (
              <div className="w-full h-full px-2"> 
                <ProductClientCard 
                  product={product} 
                  onAddToCart={(p) => console.log("Carrito:", p.nombre)}
                  onQuickView={(p) => console.log("Detalle:", p.id)}
                />
              </div>
            )}
          />
        </div>

        {/* Estilo extra para forzar las 3 columnas si tu DataCardTable usa un grid genérico */}
        <style dangerouslySetInnerHTML={{ __html: `
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          @media (min-width: 768px) {
            .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4 {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }
          }
        `}} />
      </div>
    </section>
  )
}