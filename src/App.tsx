import { RouterProvider, createRouter } from '@tanstack/react-router'

// Importamos el árbol generado automáticamente
import { routeTree } from './routeTree.gen'

// 1. Creamos la instancia del router
const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false, // Valor por defecto
  },
})

// 2. Registramos los tipos para TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  // 🔥 AQUÍ CONTROLAS EL ESTADO GLOBAL (Auth)
  const isAuthenticated = false // <--- CAMBIA A TRUE PARA ENTRAR

  return (
    <RouterProvider 
      router={router} 
      context={{ isAuthenticated }} 
    />
  )
}

export default App