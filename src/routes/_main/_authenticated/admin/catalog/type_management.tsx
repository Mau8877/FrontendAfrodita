import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { ProductTypesScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/type_management',
)({
  component: () => (
    <PermissionGuard permission="gestionar_tipo_producto">
      <ProductTypesScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Ver Productos',
      icon: 'Layer',
      hidden: false
    }
  }
})

