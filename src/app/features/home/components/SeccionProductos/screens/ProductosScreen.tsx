const categorias = [
  { id: 1, name: 'Lentes', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1780&auto=format&fit=crop' },
  { id: 2, name: 'Líquidos', img: 'https://images.unsplash.com/photo-1555633514-abcee6ad93e1?q=80&w=1780&auto=format&fit=crop' },
  { id: 3, name: 'Accesorios', img: 'https://images.unsplash.com/photo-1625591338072-430be3493892?q=80&w=1780&auto=format&fit=crop' },
]

export function ProductosScreen() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {categorias.map((cat) => (
        <button 
          key={cat.id}
          className="relative h-40 group overflow-hidden rounded-xl shadow-md active:scale-95 transition-all"
        >
          <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-secondary/40 group-hover:bg-secondary/20 transition-colors flex items-center justify-center">
            <span className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-lg">{cat.name}</span>
          </div>
        </button>
      ))}
    </section>
  )
}