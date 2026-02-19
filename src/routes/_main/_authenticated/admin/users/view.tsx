import { createFileRoute } from '@tanstack/react-router'
import { UserViewScreen } from '@/app/features/users'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'

export const Route = createFileRoute('/_main/_authenticated/admin/users/view')({
  component: () => (
    <PermissionGuard permission='ver_clientes'>
      <UserViewScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Directorio de Usuarios',
      icon: 'Users',
      hidden: false
    }
  }
})