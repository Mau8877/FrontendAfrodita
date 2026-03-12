import { Link } from '@tanstack/react-router'
// Importación de los activos locales
import tonoCeleste from '@/assets/homePage/Tonos/Tono Celeste.png'
import tonoVerde from '@/assets/homePage/Tonos/Tono Verde.png'
import tonoMiel from '@/assets/homePage/Tonos/Tono Miel.png'
import tonoGris from '@/assets/homePage/Tonos/Tono Gris.png'

const TONOS = [
  { id: 1, name: 'Celeste', img: tonoCeleste },
  { id: 2, name: 'Verde', img: tonoVerde },
  { id: 3, name: 'Miel', img: tonoMiel },
  { id: 4, name: 'Gris', img: tonoGris },
]

export function TonosScreen() {
  return (
    <section className="py-20 w-full flex flex-col items-center px-4 md:px-8">
      {/* Encabezado con más aire */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter">
          Nuestros Tonos
        </h2>
        <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] pt-4">
          Explora la variedad cromática de Afrodita
        </p>
      </div>

      {/* Grid que ocupa todo el ancho disponible hasta un máximo de 1280px */}
      <div className="w-full max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
        {TONOS.map((tono) => (
          <Link
            key={tono.id}
            to="/catalog"
            search={{ color: tono.name }}
            className="group flex flex-col items-center transition-all active:scale-95"
          >
            {/* Imagen Cuadrada Más Grande: h-64 md:h-80 asegura presencia en la page */}
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group-hover:shadow-secondary/40 transition-all duration-700">
              <img
                src={tono.img}
                alt={`Tono ${tono.name}`}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Overlay de interacción */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Etiqueta del Tono con mayor tamaño de fuente */}
            <div className="mt-6 flex flex-col items-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-secondary transition-colors">
                Colección
              </span>
              <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-800">
                {tono.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}