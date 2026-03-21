/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from '@tanstack/react-router'
import logoFreshLady from '@/assets/homePage/Marcas/FreshLady Logo.png'
import logoUrbanLayer from '@/assets/homePage/Marcas/Urban Layer Logo.jpg'
import logoFreshGo from '@/assets/homePage/Marcas/FreshGo Logo.jpg'
import logoMagister from '@/assets/homePage/Marcas/Magister Logo.jpg'

const MARCAS = [
  { id: 1, name: 'FreshLady', img: logoFreshLady, slogan: 'Elegancia Natural', filterValue: 'FreshLady'},
  { id: 2, name: 'UrbanLayer', img: logoUrbanLayer, slogan: 'Estilo Urbano', filterValue: 'UrbanLayer' },
  { id: 3, name: 'FreshGo', img: logoFreshGo, slogan: 'Comodidad Diaria', filterValue: 'FreshGo' },
  { id: 4, name: 'Magister', img: logoMagister, slogan: 'Mirada Profesional', filterValue: 'Magister' },
]

export function MarcasScreen() {
  return (
    <section className="py-8 md:py-24 w-full flex flex-col items-center px-1 md:px-12 bg-white">
      
      {/* ENCABEZADO */}
      <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-1">
        <h2 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
          Marcas Exclusivas
        </h2>
        <div className="h-1 w-12 md:h-1.5 md:w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em] pt-2 md:pt-4">
          Solo lo mejor para tus ojos en Afrodita
        </p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-4 gap-1 md:gap-12">
        {MARCAS.map((marca) => (
          <Link
            key={marca.id}
            to="/catalog" 
            search={{ 
              marca: marca.filterValue, 
              page: 1 
            } as any}
            className="group flex flex-col items-center transition-all active:scale-95 overflow-hidden"
          >
            <div className="w-full h-20 md:h-44 flex items-center justify-center px-2">
              <img
                src={marca.img}
                alt={`Logo ${marca.name}`}
                className="max-h-[85%] md:max-h-[95%] max-w-[90%] md:max-w-full object-contain opacity-70 md:opacity-50 md:group-hover:opacity-100 md:group-hover:scale-105 transition-all duration-500"
              />
            </div>

            {/* CONTENEDOR DE TEXTOS */}
            <div className="mt-1 md:mt-6 flex flex-col items-center w-full">
              <div className="h-[1.2rem] md:h-[1.5rem] flex items-center justify-center w-full px-1">
                <span className="text-[6px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-slate-300 text-center leading-none">
                  {marca.slogan}
                </span>
              </div>
              
              <span className="text-[10px] md:text-xl font-black uppercase tracking-tighter text-slate-800 mt-0.5 md:mt-1 group-hover:text-secondary transition-colors duration-300 text-center truncate w-full px-0.5">
                {marca.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}