import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'

// --- IMPORTACIONES DE CLIENTE ---
import { HeaderScreen as HeaderClient } from '@/components/layout/headerClient' 
import { SidebarScreen as SidebarClient } from '@/components/layout/sidebarClient'
// Importamos el Drawer (Menú Móvil) del Cliente
import { SidebarDrawer as SidebarDrawerClient } from '@/components/layout/sidebarClient/components/SidebarDrawer'

// --- IMPORTACIONES DE ADMIN ---
import { HeaderScreen as HeaderAdmin } from '@/components/layout/headerAdmin'
import { SidebarScreen as SidebarAdmin } from '@/components/layout/sidebarAdmin'
// Importamos el Drawer (Menú Móvil) del Admin
import { SidebarDrawer as SidebarDrawerAdmin } from '@/components/layout/sidebarAdmin/components/SidebarDrawer'

export const Route = createFileRoute('/_main')({
  component: MainLayout,
})

function MainLayout() {
  const user = useSelector(authSelectors.user)
  const isAuthenticated = useSelector(authSelectors.isAuthenticated)
  const role = user?.rol

  const isClientView = !role || role === 'Cliente'
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-white">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      {/* Solo se montan si hay sesión activa */}
      {isClientView ? <SidebarDrawerClient /> : <SidebarDrawerAdmin />}
      {isClientView ? <HeaderClient /> : <HeaderAdmin />}

      <div className="flex flex-1 overflow-hidden">
        {isClientView ? <SidebarClient /> : <SidebarAdmin />}

        <main className="flex-1 bg-slate-50 overflow-y-auto">
          <Outlet />     
        </main>
      </div>
    </div>
  )
}