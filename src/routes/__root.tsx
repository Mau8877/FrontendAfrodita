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
      <Outlet /> {/* Aquí se renderizan todas las vistas */}
      <Toaster /> {/* Las notificaciones globales */}
    </>
  ),
})