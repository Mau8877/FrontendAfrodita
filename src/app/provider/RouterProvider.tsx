import { authSelectors } from '@/app/features/auth/store'
import { routeTree } from '@/routeTree.gen'
import {
  createRouter,
  RouterProvider as TSRouterProvider,
} from '@tanstack/react-router'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TooltipProvider } from "@/components/ui/tooltip"

export interface RouterAuthContext {
  isAuthenticated: boolean
  userRole?: string
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    isAuthenticated: false, 
    userRole: undefined,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function RouterProvider() {

  const token = useSelector(authSelectors.token)
  const user = useSelector(authSelectors.user)
  
  const isAuthenticated = !!token
  const role = user?.rol

  const contextValue = useMemo(() => {
    return {
      isAuthenticated,
      userRole: role,
    }
  }, [isAuthenticated, role])

  return (
    <TooltipProvider>
      <TSRouterProvider router={router} context={contextValue} />
    </TooltipProvider>
  )
}