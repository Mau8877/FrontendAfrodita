import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'

// --- IMPORTACIONES DE CLIENTE ---
import { HeaderScreen as HeaderClient } from '@/components/layout/headerClient' 
import { SidebarScreen as SidebarClient } from '@/components/layout/sidebarClient'
import { SidebarDrawer as SidebarDrawerClient } from '@/components/layout/sidebarClient/components/SidebarDrawer'

// --- IMPORTACIONES DE ADMIN ---
import { HeaderScreen as HeaderAdmin } from '@/components/layout/headerAdmin'
import { SidebarScreen as SidebarAdmin } from '@/components/layout/sidebarAdmin'
import { SidebarDrawer as SidebarDrawerAdmin } from '@/components/layout/sidebarAdmin/components/SidebarDrawer'

export const Route = createFileRoute('/_main')({
  component: MainLayout,
})

function MainLayout() {
  const user = useSelector(authSelectors.user)
  const isAuthenticated = useSelector(authSelectors.isAuthenticated)
  const role = user?.rol

  /**
   * Lógica de Vista:
   * 1. Si NO está autenticado, por defecto ve la interfaz de Cliente.
   * 2. Si está autenticado y su rol es 'Cliente', ve la interfaz de Cliente.
   * 3. Solo si está autenticado y tiene un rol administrativo (Admin/Superuser), ve la interfaz Admin.
   */
  const isClientView = !isAuthenticated || role === 'Cliente'

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      {/* Cambiamos el renderizado condicional: 
          Ahora el Header y Sidebar del cliente se muestran para usuarios visitantes (no logueados).
      */}
      {isClientView ? (
        <>
          <SidebarDrawerClient />
          <HeaderClient />
          <div className="flex flex-1 overflow-hidden">
            <SidebarClient />
            <main className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar">
              <Outlet />
            </main>
          </div>
        </>
      ) : (
        <>
          <SidebarDrawerAdmin />
          <HeaderAdmin />
          <div className="flex flex-1 overflow-hidden">
            <SidebarAdmin />
            <main className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar">
              <Outlet />
            </main>
          </div>
        </>
      )}
    </div>
  )
}