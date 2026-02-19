import { createFileRoute, redirect, Outlet, useNavigate } from '@tanstack/react-router'
import { store } from '@/app/store' 
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'
import { useEffect } from 'react'

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
  const isAuthenticated = useSelector(authSelectors.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden"> 
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}