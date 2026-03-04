import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { SuppliersScreen } from '@/app/features/inventory'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/inventory/suppliers',
)({
  component: () => (
    <PermissionGuard permission="gestionar_proveedores">
      <SuppliersScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Proveedores',
      icon: 'Handshake',
      hidden: false
    }
  } 
})
