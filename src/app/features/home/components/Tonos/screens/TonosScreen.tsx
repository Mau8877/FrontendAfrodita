const tonos = [
  { id: 1, name: 'Natural Gray', img: 'https://via.placeholder.com/150/808080/FFFFFF?text=Gray' },
  { id: 2, name: 'Honey Brown', img: 'https://via.placeholder.com/150/A52A2A/FFFFFF?text=Brown' },
  { id: 3, name: 'Deep Blue', img: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Blue' },
  { id: 4, name: 'Emerald Green', img: 'https://via.placeholder.com/150/008000/FFFFFF?text=Green' },
  { id: 5, name: 'Hazel Nut', img: 'https://via.placeholder.com/150/DAA520/FFFFFF?text=Hazel' },
]

export function TonosScreen() {
  return (
    <section className="py-8">
      <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Explora nuestros Tonos ✨</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {tonos.map((tono) => (
          <div key={tono.id} className="min-w-[150px] snap-center">
            <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto hover:border-secondary transition-all cursor-pointer">
              <img src={tono.img} alt={tono.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-2 text-sm font-bold text-slate-600">{tono.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}