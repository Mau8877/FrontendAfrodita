import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { ProductViewScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/product_view',
)({
  component: () => (
    <PermissionGuard permission="gestionar_catalogo">
      <ProductViewScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Ver Productos',
      icon: 'Package2',
      hidden: false
    }
  }
})