import { useSelector, useDispatch } from 'react-redux'
import { authSelectors, logout } from '@/app/features/auth/store'
import { useLogoutServerMutation } from '@/app/features/auth/store/loginApi'
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
import { useCartStore } from '@/app/features/client/catalog/hooks' // Ajusta la ruta si es necesario

export function UserActions() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Selectores de Auth
  const user = useSelector(authSelectors.user)
  const token = useSelector(authSelectors.token)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionId = useSelector((state: any) => state.auth.sessionId) as string | null
  
  const role = user?.rol
  const isAuthenticated = !!token

  // Zustand: Carrito
  const { items } = useCartStore()
  const cartItemsCount = items.reduce((total, item) => total + item.cantidad, 0)

  // Hook de la mutación de logout
  const [logoutServer, { isLoading: isLoggingOut }] = useLogoutServerMutation()

  const handleLogout = async () => {
    try {
      if (sessionId) {
        await logoutServer({ session_id: sessionId }).unwrap();
      }
    } catch (error) {
      console.error("Error al cerrar sesión en servidor:", error);
    } finally {
      dispatch(api.util.resetApiState());
      dispatch(logout());
      localStorage.clear();
      
      navigate({ to: '/login' });
      toast.info("Sesión terminada");
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      
      {/* 1. CARRITO SIEMPRE A LA IZQUIERDA */}
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-white/30 w-10 h-10 md:w-11 md:h-11 p-0 shrink-0">
          <ShoppingCart className="h-5.5 w-5.5 md:h-6 md:w-6 text-secondary" strokeWidth={2.5} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-secondary text-white text-[10px] md:text-[11px] rounded-full border border-[#F7D1D0] px-1.5 shadow-md animate-in fade-in zoom-in duration-300">
              {cartItemsCount > 9 ? '9+' : cartItemsCount}
            </span>
          )}
        </Button>
      </Link>

      {/* 2. LÍNEA DIVISORIA */}
      <div className="h-6 w-[1px] bg-secondary/20 md:mx-1 rounded-full" />

      {/* 3. SECCIÓN DE USUARIO (DERECHA) */}
      {!isAuthenticated ? (
        // --- ESTADO: INVITADO ---
        <div className="flex items-center gap-0.5 sm:gap-2">
          <Link from="/" to="/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-secondary font-bold hover:bg-secondary/10 px-3">
              Iniciar Sesión
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden text-secondary w-9 h-9">
              <LogIn className="h-5 w-5" strokeWidth={2.5} />
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
              className="text-foreground hover:bg-white/30 transition-colors disabled:opacity-50 w-9 h-9 md:w-10 md:h-10"
            >
              {isLoggingOut ? (
                <Loader2 className="h-5 w-5 text-secondary animate-spin" />
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
    </div>
  )
}