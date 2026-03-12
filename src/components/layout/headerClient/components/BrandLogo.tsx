export function BrandLogo() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      {/* Mantenemos el círculo con el color de la marca y la animación */}
      <div className="h-10 w-10 md:h-13 md:w-13 rounded-full bg-primary/30 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 overflow-hidden border-2 border-white/20">
        
        {/* Usamos la imagen desde la carpeta public */}
        <img 
          src="/Logo Sin Numero.png" 
          alt="Afrodita Logo" 
          className="h-full w-full object-cover"
        />

      </div>
    </div>
  )
}