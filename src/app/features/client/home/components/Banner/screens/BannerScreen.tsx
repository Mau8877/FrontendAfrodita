// 1. Importación manteniendo el nombre con espacios como lo tienes en assets
import bannerImg from '@/assets/homePage/Banner/Banner Principal.png' 

export function BannerScreen() {
  return (
    <section className="relative w-full overflow-hidden bg-white shadow-sm group">
      {/* Contenedor con relación de aspecto ajustable. 
        He quitado los overlays de gradiente y textos para no tapar el diseño original de tus lentes.
      */}
      <div className="w-full h-auto">
        <img 
          src={bannerImg} 
          alt="Banner Principal Afrodita" 
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>
      
      {/* Un sutil brillo al pasar el mouse para indicar que es interactivo 
        sin ensuciar la imagen original.
      */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
    </section>
  )
}