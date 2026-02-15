import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'

// IMPORTACIONES DE CLIENTE
import { HeaderScreen as HeaderClient } from '@/components/layout/headerClient' 
import { SidebarScreen as SidebarClient } from '@/components/layout/sidebarClient'

// IMPORTACIONES DE ADMIN
import { HeaderScreen as HeaderAdmin } from '@/components/layout/headerAdmin'
import { SidebarScreen as SidebarAdmin } from '@/components/layout/sidebarAdmin'

export const Route = createFileRoute('/_main')({
  component: MainLayout,
})

function MainLayout() {
  // Obtenemos el usuario para validar su rol (usando selectores atómicos para evitar re-renders)
  const user = useSelector(authSelectors.user)
  const role = user?.rol

  // LÓGICA DE ROL: 
  // Mostramos versión CLIENTE si: no hay rol (invitado) o si es explícitamente 'cliente'
  const isClientView = !role || role === 'cliente'

  return (
    /* h-screen + overflow-hidden: Eliminan el "margen rojo" del navegador */
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      
      {/* RENDERIZADO DE HEADER */}
      {isClientView ? <HeaderClient /> : <HeaderAdmin />}

      <div className="flex flex-1 overflow-hidden">
        
        {/* RENDERIZADO DE SIDEBAR (Siempre a la izquierda) */}
        {isClientView ? <SidebarClient /> : <SidebarAdmin />}

        {/* CONTENIDO PRINCIPAL: Única zona con scroll permitido */}
        <main className="flex-1 bg-slate-50 overflow-y-auto">
          {/* El padding se maneja dentro de cada screen (como DashboardScreen) para mayor control */}
          <Outlet />     
        </main>

      </div>
    </div>
  )
}