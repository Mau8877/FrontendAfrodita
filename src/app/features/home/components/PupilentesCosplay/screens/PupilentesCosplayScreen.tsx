const cosplayItems = [
  { id: 1, char: 'Sharingan', img: 'https://images.unsplash.com/photo-1628157522850-255030283f60?q=80&w=600&auto=format&fit=crop' },
  { id: 2, char: 'Demon Slayer', img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&auto=format&fit=crop' },
  { id: 3, char: 'Ciel Phantomhive', img: 'https://images.unsplash.com/photo-1541533266116-55c2713d46d7?q=80&w=600&auto=format&fit=crop' },
]

export function PupilentesCosplayScreen() {
  return (
    <section className="py-8 bg-slate-900 -mx-6 px-6 my-10 border-y-4 border-secondary/30">
      <h3 className="text-2xl font-black text-white uppercase italic mb-6">Mundo Cosplay 🎭</h3>
      
      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {cosplayItems.map((item) => (
          <div key={item.id} className="min-w-[280px] relative group rounded-xl overflow-hidden shadow-2xl">
            <img src={item.img} alt={item.char} className="w-full h-[350px] object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <span className="text-white font-black text-xl tracking-tighter uppercase">{item.char}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}