import { MapPin, Bus, Home } from 'lucide-react'
import img1 from '@/assets/homePage/Visitanos/Imagen 1 Visitanos.png'
import img2 from '@/assets/homePage/Visitanos/Imagen 2 Visitanos.png'
import img3 from '@/assets/homePage/Visitanos/Imagen 3 Visitanos.png'

export function VisitanosScreen() {
  return (
    <section className="py-12 md:py-24 w-full flex flex-col items-center px-4 md:px-8 bg-white">
      
      {/* 1. ENCABEZADO: Consistente con el resto de la Landing */}
      <div className="text-center mb-12 md:mb-16 space-y-3">
        <h2 className="text-3xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
          Nuestra Tienda y Envíos
        </h2>
        <div className="h-1.5 w-20 md:w-24 bg-secondary mx-auto rounded-full" />
        <p className="text-[8px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em] pt-2 md:pt-4">
          Ven a vernos o recibe tu pedido donde quieras
        </p>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-16">
        
        {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
        <div className="w-full md:w-[40%] flex flex-col justify-center space-y-6 md:space-y-8">
          <div className="space-y-5 md:space-y-8">
            {/* Item 1: Tienda Física */}
            <div className="flex items-center gap-4 md:gap-5">
              <div className="p-3 md:p-4 rounded-2xl bg-secondary/10 text-secondary shrink-0">
                <MapPin className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-secondary font-black uppercase text-[10px] md:text-xs tracking-widest leading-none">Punto de Venta</span>
                <span className="text-slate-900 font-black uppercase text-sm md:text-xl tracking-tighter mt-1 md:mt-2">
                  2do anillo av. Libertad, 324
                </span>
              </div>
            </div>

            {/* Item 2: Envíos País */}
            <div className="flex items-center gap-4 md:gap-5">
              <div className="p-3 md:p-4 rounded-2xl bg-secondary/10 text-secondary shrink-0">
                <Bus className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-secondary font-black uppercase text-[10px] md:text-xs tracking-widest leading-none">Cobertura Nacional</span>
                <span className="text-slate-900 font-black uppercase text-sm md:text-xl tracking-tighter mt-1 md:mt-2">
                  por Transportadoras
                </span>
              </div>
            </div>

            {/* Item 3: Envíos Domicilio */}
            <div className="flex items-center gap-4 md:gap-5">
              <div className="p-3 md:p-4 rounded-2xl bg-secondary/10 text-secondary shrink-0">
                <Home className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-secondary font-black uppercase text-[10px] md:text-xs tracking-widest leading-none">Servicio Local</span>
                <span className="text-slate-900 font-black uppercase text-sm md:text-xl tracking-tighter mt-1 md:mt-2">
                  por Yango
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: MOSAICO (3 en fila siempre) */}
        <div className="w-full md:w-[60%] grid grid-cols-3 gap-2 md:gap-6 items-center">
          <div className="aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm md:shadow-xl transition-all duration-500">
            <img 
              src={img1} 
              alt="Tienda 1" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
            />
          </div>
          <div className="aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm md:shadow-xl transition-all duration-500">
            <img 
              src={img2} 
              alt="Tienda 2" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
            />
          </div>
          <div className="aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm md:shadow-xl transition-all duration-500">
            <img 
              src={img3} 
              alt="Tienda 3" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
            />
          </div>
        </div>

      </div>

    </section>
  )
}