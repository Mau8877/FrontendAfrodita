import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { BranchesScreen } from '@/app/features/config'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/config/branch',
)({
  component: () => (
    <PermissionGuard permission="gestionar_metodo_pago">
      <BranchesScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Sucursales',
      icon: 'Store',
      hidden: false
    }
  }  
})