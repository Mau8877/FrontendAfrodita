import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'
import { ShoppingCart, User, ShieldCheck, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export function UserActions() {
  const user = useSelector(authSelectors.user)
  const role = user?.rol
  const cartItemsCount = 3 

  // Si no hay rol, el usuario es un invitado (Guest)
  const isGuest = !role

  return (
    <div className="flex items-center gap-2">
      {isGuest ? (
        // --- ESTADO: INVITADO ---
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botón Login: Más discreto */}
          <Link from="/" to="/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-secondary font-bold hover:bg-secondary/10">
              Iniciar Sesión
            </Button>
            {/* Icono solo en móvil para no saturar */}
            <Button variant="ghost" size="icon" className="sm:hidden text-secondary">
              <LogIn className="h-5.5 w-5.5" strokeWidth={2.5} />
            </Button>
          </Link>

          {/* Botón Registro: El "Call to Action" principal */}
          <Link from="/" to="/register">
            <Button size="sm" className="bg-secondary text-white hover:bg-secondary/90 shadow-sm font-bold h-9 px-4 rounded-full transition-all active:scale-95">
              Registrarse
            </Button>
          </Link>
        </div>
      ) : (
        // --- ESTADO: AUTENTICADO (Admin o Cliente) ---
        <div className="relative group">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/30 transition-colors">
            {role === 'admin' ? (
              <ShieldCheck className="h-5.5 w-5.5 text-secondary" strokeWidth={2.5} />
            ) : (
              <User className="h-5.5 w-5.5 text-secondary" strokeWidth={2.5} />
            )}
          </Button>

          {/* Tooltip de Rol */}
          <div className="absolute top-full right-0 mt-2 scale-0 group-hover:scale-100 transition-all duration-200 origin-top-right z-50">
            <div className="bg-secondary text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
              {role}
            </div>
          </div>
        </div>
      )}

      {/* CARRITO: Se mantiene siempre visible */}
      <div className="h-8 w-[1px] bg-black/5 mx-1 hidden sm:block" /> {/* Separador visual */}
      
      <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-white/30">
        <ShoppingCart className="h-5.5 w-5.5 text-secondary" strokeWidth={2.5} />
        {cartItemsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary border-2 border-header shadow-sm"></span>
          </span>
        )}
      </Button>
    </div>
  )
}