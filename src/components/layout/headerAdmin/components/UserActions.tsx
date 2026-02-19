import { useSelector, useDispatch } from 'react-redux'
import { authSelectors, logout } from '@/app/features/auth/store'
import { ShoppingCart, User, ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from '@/app/store/api/api'

export function UserActions() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(authSelectors.user)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(api.util.resetApiState())
    localStorage.clear()
    navigate({ to: '/login' })
  }

  // Helper para que el rol se vea bonito (ej: "super_user" -> "Super User")
  const formatRole = (role: string) => {
    return role ? role.replace('_', ' ') : 'Staff'
  }

  return (
    <div className="flex items-center gap-4">
      {/* 1. ÍCONO DE CARRITO */}
      <Button variant="ghost" size="icon" className="relative text-slate-700 hover:bg-white/40 rounded-full transition-colors">
        <ShoppingCart className="h-5 w-5 text-secondary" strokeWidth={2.5} />
      </Button>

      {/* Separador vertical */}
      <div className="h-6 w-[1px] bg-secondary/20 hidden sm:block" />

      {/* 2. USUARIO CON INFORMACIÓN MEJORADA */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 hover:bg-white/40 py-1 px-2 rounded-xl transition-all outline-none group">
            
            {/* TEXTO: Nombre y Rol */}
            <div className="flex flex-col items-end text-right hidden md:flex">
              <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-secondary transition-colors">
                {user?.username || 'Administrador'}
              </span>
              
              <span className="text-[10px] font-bold text-secondary/90 uppercase tracking-wider mt-0.5">
                {formatRole(user?.rol || 'Super User')}
              </span>
            </div>

            {/* Avatar */}
            <div className="h-9 w-9 bg-white/60 group-hover:bg-white border border-secondary/20 rounded-full flex items-center justify-center shadow-sm transition-all">
              <User className="h-4.5 w-4.5 text-secondary" strokeWidth={2.5} />
            </div>
            
            <ChevronDown className="h-3.5 w-3.5 text-secondary/50 group-hover:text-secondary transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-lg border-secondary/10 bg-white/95 backdrop-blur">
          <DropdownMenuLabel className="font-bold text-xs text-secondary/70 uppercase tracking-wider px-3 py-2">
            Mi Cuenta
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-secondary/10" />
          <DropdownMenuItem className="cursor-pointer font-medium text-slate-700 focus:text-secondary focus:bg-secondary/5">
            <User className="mr-2 h-4 w-4" /> Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-secondary/10" />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer font-bold"
          >
            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}