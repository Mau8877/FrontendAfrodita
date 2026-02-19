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
  // Obtenemos el usuario para validar su rol
  const user = useSelector(authSelectors.user)
  const role = user?.rol

  // LÓGICA DE ROL: 
  // Mostramos versión CLIENTE si: no hay rol (invitado) o si es explícitamente 'cliente'
  const isClientView = !role || role === 'Cliente'

  return (
    /* h-screen + overflow-hidden: Layout base que ocupa toda la pantalla sin scroll global */
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      
      {/* 1. DRAWERS (MENÚS MÓVILES) 
          Estos componentes son invisibles por defecto y solo aparecen 
          cuando das clic a la hamburguesa (controlado por Redux).
          ¡Son obligatorios para que funcione en el celular! 
      */}
      {isClientView ? <SidebarDrawerClient /> : <SidebarDrawerAdmin />}
      
      {/* 2. HEADERS (Barra superior) */}
      {isClientView ? <HeaderClient /> : <HeaderAdmin />}

      <div className="flex flex-1 overflow-hidden">
        
        {/* 3. SIDEBARS FIJOS (Solo visibles en Escritorio) 
            Dentro de estos componentes ya tienes la clase 'hidden lg:flex',
            así que no estorban en móvil.
        */}
        {isClientView ? <SidebarClient /> : <SidebarAdmin />}

        {/* 4. CONTENIDO PRINCIPAL (El único con scroll) */}
        <main className="flex-1 bg-slate-50 overflow-y-auto">
          {/* Aquí se renderizan tus páginas (Dashboard, Home, etc.) */}
          <Outlet />     
        </main>

      </div>
    </div>
  )
}