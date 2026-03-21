/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from '@tanstack/react-router'
import lentesImg from '@/assets/homePage/TipoProductos/Lentes.png'
import liquidosImg from '@/assets/homePage/TipoProductos/Liquidos.png'
import accesoriosImg from '@/assets/homePage/TipoProductos/Accesorios.png'

const TIPO_PRODUCTO = [
  { id: 1, name: 'Lentes', img: lentesImg, filterValue: 'Lentes' },
  { id: 2, name: 'Líquidos', img: liquidosImg, filterValue: 'Líquidos' },
  { id: 3, name: 'Accesorios', img: accesoriosImg, filterValue: 'Estuches' }, 
]

export function TipoProductosScreen() {
  return (
    <section className="py-8 md:py-12 w-full">
      <div className="flex flex-row items-center justify-center gap-4 md:gap-16 lg:gap-24 px-2 overflow-hidden">
        {TIPO_PRODUCTO.map((type) => (
          <Link 
            key={type.id} 
            to="/catalog"
            search={{ 
              tipo: type.filterValue, 
              page: 1 
            } as any}
            className="group flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 active:scale-95 flex-shrink-0"
          >
            <div className="relative h-20 w-20 md:h-40 md:w-40 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg bg-white group-hover:shadow-secondary/20 group-hover:border-secondary/20 transition-all duration-500">
              <img 
                src={type.img} 
                alt={type.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <span className="text-[9px] md:text-[13px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-slate-500 group-hover:text-secondary transition-colors duration-300">
              {type.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}