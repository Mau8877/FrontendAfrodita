import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { LoginLogsScreen } from '@/app/features/bitacora'

export const Route = createFileRoute('/_main/_authenticated/admin/security/login-logs',)({
  component: () => (
      <PermissionGuard permission="ver_bitacora_login">
        <LoginLogsScreen />
      </PermissionGuard>
    ),
    staticData: {
      metaRoute: {
        title: 'Bitácora Login',
        icon: 'Lock',
        hidden: false
      }
    }
})

