import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '@/app/store'
import { close } from '../store/sidebarSlice'
import { X, Home, ShoppingBag, MapPin, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export function SidebarContent() {
  const dispatch = useDispatch()
  
  // Definimos los links con sus iconos y rutas
  const clientLinks = [
    { label: 'Inicio', to: '/', icon: Home },
    { label: 'Productos', to: '/productos', icon: ShoppingBag },
    { label: 'Contacto', to: '/visitanos', icon: MapPin },
    { label: 'Preguntas Frecuentes', to: '/faq', icon: HelpCircle },
  ]

  const closeSidebar = () => dispatch(close())

  return (
    <div className="flex flex-col h-full bg-[#F4AFCC] border-r border-black/5">
      {/* HEADER DEL SIDEBAR */}
      <div className="p-6 border-b border-black/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.3em]">Menú</span>
          <span className="text-xl font-black text-foreground italic tracking-tighter">Afrodita</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={closeSidebar}
          className="h-9 w-9 rounded-full hover:bg-white/20 text-foreground transition-all"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 p-4 mt-4 space-y-3">
        {clientLinks.map((item) => (
          <Link 
            key={item.label}
            to={item.to}
            onClick={closeSidebar}
            // Clases de TanStack Router para cuando la ruta está activa
            activeProps={{ className: 'bg-primary text-white shadow-md' }}
            inactiveProps={{ className: 'text-foreground/70 hover:bg-white/30' }}
            className="group flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer"
          >
            {/* Contenedor del Icono */}
            <div className="bg-sidebar/60 p-2 rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
              <item.icon className="h-5 w-5 text-secondary group-hover:text-white" strokeWidth={2.5} />
            </div>
            
            <span className="tracking-tight uppercase text-xs font-black">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* FOOTER DEL SIDEBAR */}
      <div className="p-8 bg-black/5">
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-8 bg-secondary/20 rounded-full" />
          <span className="text-[9px] text-foreground/40 font-black uppercase tracking-[0.4em]">
            Realza tu mirada
          </span>
        </div>
      </div>
    </div>
  )
}