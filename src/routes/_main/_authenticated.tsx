import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { store } from '@/app/store' 

export const Route = createFileRoute('/_main/_authenticated')({
  beforeLoad: ({ location }) => {
    const { token, user } = store.getState().auth
    if (!token || !user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden"> 
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}