const modelos = [
  { id: 1, name: 'Ava Grey', price: '$25.00', img: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Misty Blue', price: '$28.00', img: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Amber Gold', price: '$25.00', img: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop' },
]

export function NuevosModelosScreen() {
  return (
    <section className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 uppercase italic">Nuevos Modelos</h3>
          <div className="h-1 w-20 bg-secondary mt-1"></div>
        </div>
        <button className="text-sm font-bold text-secondary hover:underline">Ver todos</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelos.map((m) => (
          <div key={m.id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 shadow-md">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-secondary">NUEVO</div>
            </div>
            <div className="mt-3 flex justify-between items-center px-1">
              <h4 className="font-bold text-slate-700">{m.name}</h4>
              <span className="font-black text-secondary">{m.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}