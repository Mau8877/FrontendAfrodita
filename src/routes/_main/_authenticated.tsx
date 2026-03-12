/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { store } from '@/app/store' 
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'

// Definimos los roles que tienen permiso para acceder al panel administrativo
const ROLES_AUTORIZADOS = ['Super User', 'Admin', 'Vendedor'];

export const Route = createFileRoute('/_main/_authenticated')({
  beforeLoad: ({ location }) => {
    const { token, user } = store.getState().auth
    const role = user?.rol

    // 1. Verificación de Autenticación
    if (!token || !user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // 2. Verificación de Autorización (Roles Administrativos)
    // Si el rol no está en la lista de autorizados, lo mandamos a la raíz del cliente
    if (!ROLES_AUTORIZADOS.includes(role || '')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const isAuthenticated = useSelector(authSelectors.isAuthenticated)

  // Si por algún motivo el estado de Redux cambia y se desloguea, 
  // el beforeLoad de la siguiente navegación lo atrapará, 
  // pero aquí evitamos renderizar contenido sensible.
  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50"> 
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>
    </div>
  )
}