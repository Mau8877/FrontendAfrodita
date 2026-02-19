import { RouterProvider, createRouter } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'
import { routeTree } from './routeTree.gen'
import { AccessDenied } from '@/app/features/auth/components/AccessDenied'

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: AccessDenied,
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

function App() {
  const isAuthenticated = useSelector(authSelectors.isAuthenticated)
  const user = useSelector(authSelectors.user)

  return (
    <RouterProvider 
      router={router} 
      context={{ 
        isAuthenticated,
        userRole: user?.rol 
      }} 
    />
  )
}

export default App