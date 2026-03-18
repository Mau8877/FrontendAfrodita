import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from "@/components/ui/sonner"

// Definimos qué datos "inyectaremos" desde el main.tsx
interface RouterContext {
  isAuthenticated: boolean,
  userRole?: string,
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="h-screen w-full overflow-y-auto custom-scrollbar">
        <Outlet /> {/* Aquí se renderizan todas las vistas */}
      </div>
      <Toaster /> {/* Las notificaciones globales */}
    </>
  ),
})