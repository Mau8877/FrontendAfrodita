import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { ColorsScreen } from '@/app/features/catalog'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/catalog/color_management',
)({
  component: () => (
    <PermissionGuard permission="gestionar_colores">
      <ColorsScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Colores',
      icon: 'Palette',
      hidden: false
    }
  }
})