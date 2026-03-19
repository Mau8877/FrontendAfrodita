import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { TonosScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/tonos_management',
)({
  component: () => (
    <PermissionGuard permission="gestionar_tonos">
      <TonosScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Tonos',
      icon: 'SwatchBook',
      hidden: false
    }
  }
})

