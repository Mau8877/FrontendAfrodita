// 1. Importación manteniendo el nombre con espacios como lo tienes en assets
import bannerImg from '@/assets/homePage/Banner/Banner Principal.png' 

export function BannerScreen() {
  return (
    <section className="relative w-full overflow-hidden bg-white shadow-sm group">
      <div className="w-full h-auto md:h-[50vh] overflow-hidden">
        <img 
          src={bannerImg} 
          alt="Banner Principal Afrodita" 
          className="w-full h-full block object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>
      
      {/* Brillo interactivo */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
    </section>
  )
}