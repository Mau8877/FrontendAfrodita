import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { BrandsScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/brands_management',
)({
  component: () => (
    <PermissionGuard permission="gestionar_marcas">
      <BrandsScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Marcas',
      icon: 'Badge',
      hidden: false
    }
  }
})