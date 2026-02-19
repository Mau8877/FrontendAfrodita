import { createFileRoute } from '@tanstack/react-router'
import { UserManagementScreen } from '@/app/features/users'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'

export const Route = createFileRoute('/_main/_authenticated/admin/users/management')({
  component: () => (
    <PermissionGuard permission="gestionar_usuarios">
      <UserManagementScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestión de Usuarios',
      icon: 'UsersCog',
      hidden: false
    }
  }
})