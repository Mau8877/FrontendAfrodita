import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { store } from '@/app/store' 

export const Route = createFileRoute('/_authenticated')({
  // 1. EL GUARDIA (Se ejecuta ANTES de cargar la ruta) 👮‍♂️
  beforeLoad: ({ location }) => {
    // Leemos el estado directamente desde la "Caja Fuerte" (Redux)
    const { token, user } = store.getState().auth

    // Si no hay token o no hay usuario... ¡FUERA!
    if (!token || !user) {
      throw redirect({
        to: '/login',
        // Opcional: Guardamos a dónde quería ir para redirigirlo después
        search: {
          redirect: location.href,
        },
      })
    }
  },

  // 2. EL COMPONENTE (El layout visual) 🎨
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Aquí podrías poner un Navbar o Sidebar global para todo el dashboard */}
      
      {/* <Outlet /> es donde se renderizan los hijos (Dashboard, Perfil, etc.) */}
      <Outlet />
    </div>
  )
}