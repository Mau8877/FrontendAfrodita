import { useSelector, useDispatch } from 'react-redux'
import { authSelectors, logout } from '@/app/features/auth/store'
import { useLogoutServerMutation } from '@/app/features/auth/store/loginApi' // Importamos la mutación
import { ShoppingCart, User, ShieldCheck, LogIn, UserPlus, LogOut, Package, UserCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
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
  
  // Selectores
  const user = useSelector(authSelectors.user)
  const token = useSelector(authSelectors.token)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionId = useSelector((state: any) => state.auth.sessionId) as string | null
  
  const role = user?.rol
  const cartItemsCount = 3 // Esto luego vendrá de tu slice de carrito
  const isAuthenticated = !!token

  // Hook de la mutación de logout
  const [logoutServer, { isLoading: isLoggingOut }] = useLogoutServerMutation()

  // Lógica de cierre de sesión idéntica a la de Admin
  const handleLogout = async () => {
    try {
      if (sessionId) {
        // 1. Intentamos avisar al servidor para cerrar el log de sesión
        await logoutServer({ session_id: sessionId }).unwrap();
      }
    } catch (error) {
      console.error("Error al cerrar sesión en servidor:", error);
    } finally {
      // 2. Limpieza total independientemente de si falló el servidor o no
      dispatch(api.util.resetApiState()); // Limpia cache de RTK Query
      dispatch(logout()); // Limpia el estado de auth (token, user, etc)
      localStorage.clear(); // Limpia almacenamiento persistente
      
      navigate({ to: '/login' });
      toast.info("Sesión terminada");
    }
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {!isAuthenticated ? (
        // --- ESTADO: INVITADO ---
        <div className="flex items-center gap-0.5 sm:gap-2">
          <Link from="/" to="/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-secondary font-bold hover:bg-secondary/10">
              Iniciar Sesión
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden text-secondary w-9 h-9">
              <LogIn className="h-5.5 w-5.5" strokeWidth={2.5} />
            </Button>
          </Link>

          <Link from="/" to="/register">
            <Button size="sm" className="bg-secondary text-white hover:bg-secondary/90 shadow-sm font-bold h-9 sm:h-9 w-9 sm:w-auto px-0 sm:px-4 rounded-full transition-all active:scale-95">
              <span className="hidden sm:inline">Registrarse</span>
              <UserPlus className="sm:hidden h-5 w-5" strokeWidth={2.5} /> 
            </Button>
          </Link>
        </div>
      ) : (
        // --- ESTADO: AUTENTICADO ---
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={isLoggingOut}
              className="text-foreground hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="h-5.5 w-5.5 text-secondary animate-spin" />
              ) : (
                role === 'Admin' || role === 'Super User' ? (
                  <ShieldCheck className="h-5.5 w-5.5 text-secondary" strokeWidth={2.5} />
                ) : (
                  <User className="h-5.5 w-5.5 text-secondary" strokeWidth={2.5} />
                )
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-52 mt-2 rounded-2xl shadow-xl border-none bg-white p-2">
            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400 px-3 py-2">
              {user?.username || 'Mi Cuenta'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 mx-2" />
            
            <DropdownMenuItem className="py-3 rounded-xl cursor-pointer gap-3 font-bold text-slate-700 focus:bg-secondary/10 focus:text-secondary">
              <UserCircle className="h-4.5 w-4.5" /> Mi Perfil
            </DropdownMenuItem>
            
            <DropdownMenuItem className="py-3 rounded-xl cursor-pointer gap-3 font-bold text-slate-700 focus:bg-secondary/10 focus:text-secondary">
              <Package className="h-4.5 w-4.5" /> Mis Pedidos
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-slate-100 mx-2" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="py-3 rounded-xl cursor-pointer gap-3 font-bold text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <LogOut className="h-4.5 w-4.5" />
              )}
              {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* CARRITO */}
      <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-white/30 w-9 h-9">
        <ShoppingCart className="h-5.5 w-5.5 text-secondary" strokeWidth={2.5} />
        {cartItemsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary border-2 border-[#F7D1D0] shadow-sm"></span>
          </span>
        )}
      </Button>
    </div>
  )
}