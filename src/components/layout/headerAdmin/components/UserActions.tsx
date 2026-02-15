import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'
import { ShieldCheck, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from '@tanstack/react-router'

export function UserActions() {
  const user = useSelector(authSelectors.user)
  const navigate = useNavigate()
  const location = useLocation()

  // Verificamos si estamos en una ruta de admin o de cliente
  const isAdminPath = location.pathname.includes('/dashboard') || location.pathname.includes('/admin')

  return (
    <div className="flex items-center gap-4">
      {/* PILL DE MODO DINÁMICA */}
      <div 
        onClick={() => {
          if (isAdminPath) {
            navigate({ to: '/' }) // Si está en admin, lo mandamos a la tienda
          } else {
            navigate({ to: '/dashboard' }) // Si está en tienda, lo devolvemos al dashboard
          }
        }}
        className="flex items-center bg-slate-100 rounded-full p-1 cursor-pointer hover:shadow-md transition-all border border-slate-200 group overflow-hidden"
      >
        {/* Lado Admin */}
        <div className={`
          text-[10px] font-bold px-3 py-1 rounded-full transition-all duration-300
          ${isAdminPath 
            ? 'bg-secondary text-white shadow-sm' 
            : 'text-slate-400 group-hover:text-secondary'}
        `}>
          ADMIN
        </div>

        {/* Icono de intercambio */}
        <div className="px-1 text-slate-300">
          <ArrowLeftRight className="h-3 w-3" />
        </div>

        {/* Lado Client */}
        <div className={`
          text-[10px] font-bold px-3 py-1 rounded-full transition-all duration-300
          ${!isAdminPath 
            ? 'bg-secondary text-white shadow-sm' 
            : 'text-slate-400 group-hover:text-secondary'}
        `}>
          CLIENT
        </div>
      </div>

      {/* PERFIL (Solo icono de escudo para Admin) */}
      <div className="relative group">
        <Button variant="ghost" size="icon" className="text-secondary hover:bg-secondary/10 rounded-full">
          <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
        </Button>
        
        {/* Tooltip con nombre */}
        <div className="absolute top-full right-0 mt-2 scale-0 group-hover:scale-100 transition-all z-50 pointer-events-none">
          <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
            {user?.username || 'Administrador'}
          </div>
        </div>
      </div>
    </div>
  )
}