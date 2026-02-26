import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { ProductManagementScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/product_management',
)({
  component: () => (
    <PermissionGuard permission="gestionar_catalogo">
      <ProductManagementScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Productos',
      icon: 'PackageOpen',
      hidden: false
    }
  }
})
