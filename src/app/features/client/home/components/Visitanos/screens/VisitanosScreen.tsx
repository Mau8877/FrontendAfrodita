import { MapPin, Clock, Phone } from 'lucide-react'

export function VisitanosScreen() {
  return (
    <section className="py-12 px-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center justify-between my-12">
      <div className="space-y-6 max-w-md">
        <h3 className="text-3xl font-black text-slate-800">Visítanos en tienda 📍</h3>
        <p className="text-slate-500 font-medium leading-relaxed">
          Pruébate tus tonos favoritos y recibe asesoría personalizada para el cuidado de tus lentes.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <MapPin className="text-secondary h-5 w-5" />
            <span className="text-sm font-bold">Av. Principal 123, Ciudad de Afrodita</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Clock className="text-secondary h-5 w-5" />
            <span className="text-sm font-bold">Lunes a Sábado: 9:00 AM - 8:00 PM</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="text-secondary h-5 w-5" />
            <span className="text-sm font-bold">+591 70000000</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-64 bg-slate-200 rounded-2xl overflow-hidden shadow-inner grayscale hover:grayscale-0 transition-all duration-500">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" 
          alt="Tienda Física" 
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}