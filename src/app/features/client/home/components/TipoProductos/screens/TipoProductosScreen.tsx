import { Link } from '@tanstack/react-router'
// 1. Importación de tus imágenes locales
import lentesImg from '@/assets/homePage/TipoProductos/Lentes.png'
import liquidosImg from '@/assets/homePage/TipoProductos/Liquidos.png'
import accesoriosImg from '@/assets/homePage/TipoProductos/Accesorios.png'

const CATEGORIAS = [
  { id: 1, name: 'Lentes', img: lentesImg, path: '/catalog/lentes' },
  { id: 2, name: 'Líquidos', img: liquidosImg, path: '/catalog/liquidos' },
  { id: 3, name: 'Accesorios', img: accesoriosImg, path: '/catalog/accesorios' },
]

export function TipoProductosScreen() {
  return (
    <section className="py-12 w-full">
      {/* Contenedor principal centrado y con distribución horizontal */}
      <div className="flex flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 px-4 flex-wrap">
        {CATEGORIAS.map((cat) => (
          <Link 
            key={cat.id} 
            to={cat.path}
            className="group flex flex-col items-center gap-4 transition-all duration-300 active:scale-95"
          >
            {/* Contenedor de la Imagen Circular */}
            <div className="relative h-28 w-28 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white group-hover:shadow-secondary/20 group-hover:border-secondary/20 transition-all duration-500">
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay sutil al pasar el mouse */}
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Etiqueta de la Categoría */}
            <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-secondary transition-colors duration-300">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}