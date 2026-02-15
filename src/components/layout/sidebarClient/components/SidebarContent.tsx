import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '@/app/store'
import { close } from '../store/sidebarSlice'
import { X, ShieldCheck, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SidebarContent() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const links = user?.rol === 'admin' 
    ? ['Dashboard', 'Usuarios', 'Reportes'] 
    : ['Mi Perfil', 'Mis Pedidos', 'Favoritos']

  return (
    // CAMBIO: Usamos bg-sidebar para que tome el #F7D1D0 del CSS
    <div className="flex flex-col h-full bg-sidebar border-r border-black/5">
      <div className="p-5 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          {/* Usamos el color secundario (Púrpura) para los iconos para que resalten */}
          {user?.rol === 'admin' ? (
            <ShieldCheck className="w-5 h-5 text-secondary" /> 
          ) : (
            <User className="w-5 h-5 text-secondary" />
          )}
          <span className="font-bold tracking-tight text-foreground italic">Afrodita</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => dispatch(close())}
          // El hover con primary/20 sobre el fondo nude queda muy fino
          className="h-8 w-8 rounded-full hover:bg-primary/20 text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-[0.2em] ml-2 mb-4">
          Navegación
        </p>
        
        {links.map((link) => (
          <div 
            key={link} 
            // Usamos primary para el hover y white para el texto del hover
            className="p-3 text-sm font-medium text-foreground/80 hover:bg-primary hover:text-primary-foreground rounded-xl cursor-pointer transition-all flex items-center gap-3 group shadow-sm hover:shadow-primary/20"
          >
             {/* El puntito blanco en hover sobre el rosa queda excelente */}
             <div className="w-1.5 h-1.5 rounded-full bg-secondary/30 group-hover:bg-primary-foreground" />
             {link}
          </div>
        ))}
      </nav>

      <div className="p-6 bg-black/5">
        <div className="text-[10px] text-foreground/40 text-center font-bold uppercase tracking-widest">
          Afrodita System
        </div>
      </div>
    </div>
  )
}