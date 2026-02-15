export function BannerScreen() {
  return (
    <section className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-2xl shadow-lg relative">
      <img 
        src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070&auto=format&fit=crop" 
        alt="Banner Afrodita"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center p-8 md:p-16">
        <div className="max-w-md">
          <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-md">AFRODITA</h2>
          <p className="text-white mt-2 font-medium bg-secondary/80 inline-block px-2">Realza tu mirada.</p>
        </div>
      </div>
    </section>
  )
}