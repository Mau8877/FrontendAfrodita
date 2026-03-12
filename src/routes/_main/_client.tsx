import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { FooterScreen } from '@/components/layout/footer'

export const Route = createFileRoute('/_main/_client')({
  // El context viene definido desde tu createRootRouteWithContext
  beforeLoad: ({ context, location }) => {
    /**
     * REDIRECCIÓN FORZADA PARA ADMINISTRADORES:
     * Si el usuario está autenticado y su rol NO es 'Cliente', 
     * significa que es un Admin o Superuser. 
     */
    if (context.isAuthenticated && context.userRole !== 'Cliente') {
      // Si intenta navegar por las rutas del cliente (fuera de /admin)
      if (!location.pathname.includes('/admin')) {
        throw redirect({
          to: '/admin/dashboard',
        })
      }
    }
  },
  component: ClientLayout,
})

function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Outlet /> 
      </div>
      <FooterScreen />
    </div>
  )
}