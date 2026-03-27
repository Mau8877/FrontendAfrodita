import { useSelector, useDispatch } from 'react-redux'
import { authSelectors, logout } from '@/app/features/auth/store'
import { useLogoutServerMutation } from '@/app/features/auth/store/loginApi'
import { User, ChevronDown, LogOut, Loader2, UserCircle } from 'lucide-react'
import { useNavigate, Link } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from '@/app/store/api/api'
import { toast } from 'sonner'

export function UserActions() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // 2. Selectores para obtener los datos necesarios
  const user = useSelector(authSelectors.user)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionId = useSelector((state: any) => state.auth.sessionId) as string | null

  // 3. Hook de la mutación de logout
  const [logoutServer, { isLoading: isLoggingOut }] = useLogoutServerMutation()

  // 4. Lógica de cierre de sesión mejorada
  const handleLogout = async () => {
    const currentSessionId = sessionId;

    try {
      if (currentSessionId) {
        // 1. Notificación Exitosa
        await logoutServer({ session_id: currentSessionId }).unwrap();
      } else {
        // 2. Alerta de sesión huérfana (solo para debug o admin)
        console.warn("No hay session_id: el log quedará como 'En Sesión'");
      }
    } catch (error) {
      console.error("Error al cerrar sesión en servidor:", error);
    } finally {
      // 3. Limpieza total (Esto ya lo haces perfecto)
      dispatch(api.util.resetApiState());
      dispatch(logout());
      localStorage.clear();
      navigate({ to: '/login' });
      toast.info("Sesión terminada");
    }
  };

  // Helper para que el rol se vea bonito
  const formatRole = (role: string) => {
    return role ? role.replace('_', ' ') : 'Staff'
  }

  return (
    <div className="flex items-center gap-4">
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            disabled={isLoggingOut}
            className="flex items-center gap-3 hover:bg-white/40 py-1 px-2 rounded-xl transition-all outline-none group disabled:opacity-70"
          >
            
            {/* TEXTO: Nombre y Rol */}
            <div className="flex flex-col items-end text-right hidden md:flex">
              <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-secondary transition-colors">
                {user?.username || 'Administrador'}
              </span>
              
              <span className="text-[10px] font-bold text-secondary/90 uppercase tracking-wider mt-0.5">
                {formatRole(user?.rol || 'Super User')}
              </span>
            </div>

            {/* Avatar / Spinner de carga */}
            <div className="h-9 w-9 bg-white/60 group-hover:bg-white border border-secondary/20 rounded-full flex items-center justify-center shadow-sm transition-all">
              {isLoggingOut ? (
                <Loader2 className="h-4.5 w-4.5 text-secondary animate-spin" />
              ) : (
                <User className="h-4.5 w-4.5 text-secondary" strokeWidth={2.5} />
              )}
            </div>
            
            <ChevronDown className="h-3.5 w-3.5 text-secondary/50 group-hover:text-secondary transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-lg border-secondary/10 bg-white/95 backdrop-blur">
          <DropdownMenuLabel className="font-bold text-xs text-secondary/70 uppercase tracking-wider px-3 py-2">
            Mi Cuenta
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-secondary/10" />
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5 font-medium text-slate-700 focus:text-secondary focus:bg-secondary/5 transition-colors">
            <Link to="/admin/profile">
              <UserCircle className="mr-2 h-4.5 w-4.5" /> Ver Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-secondary/10" />
          <DropdownMenuItem 
            onClick={handleLogout}
            disabled={isLoggingOut} // Evita múltiples clics
            className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer font-bold"
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}