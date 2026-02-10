import { authSelectors } from '@/app/features/auth/store'
import { routeTree } from '@/routeTree.gen'
import {
  createRouter,
  RouterProvider as TSRouterProvider,
} from '@tanstack/react-router'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TooltipProvider } from "@/components/ui/tooltip"

// 1. Definimos la interfaz del Contexto (Lo que __root.tsx y los guards usarán)
export interface RouterAuthContext {
  isAuthenticated: boolean
  userRole?: string
}

// 2. Creamos el router e inicializamos el contexto con valores dummy
const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // Optimización: precarga al pasar el mouse
  context: {
    isAuthenticated: false, 
    userRole: undefined,
  },
})

// 3. Registramos el router para que TypeScript funcione en toda la app
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function RouterProvider() {
  // 4. Conectamos con Redux (El cerebro)
  // authSelectors.authData ya nos devuelve { role, token, ... } mapeados
  const { role, token } = useSelector(authSelectors.authData)
  
  // Calculamos si está autenticado
  const isAuthenticated = !!token

  // 5. Creamos el objeto de contexto reactivo
  // Si cambia el token o el rol en Redux, esto se actualiza automáticamente
  const contextValue = useMemo(() => {
    return {
      isAuthenticated,
      userRole: role,
    }
  }, [isAuthenticated, role])

  return (
    <TooltipProvider>
      {/* Pasamos el router y el contexto actualizado */}
      <TSRouterProvider router={router} context={contextValue} />
    </TooltipProvider>
  )
}