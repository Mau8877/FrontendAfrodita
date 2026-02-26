import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { CategoriesScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/categories_management',
)({
  component: () => (
    <PermissionGuard permission="gestionar_categorias">
      <CategoriesScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Categorias',
      icon: 'Tags',
      hidden: false
    }
  }
})
