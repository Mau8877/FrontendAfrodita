import { createFileRoute, Outlet } from '@tanstack/react-router'
import { FooterScreen } from '@/components/layout/footer'

export const Route = createFileRoute('/_main/_client')({
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