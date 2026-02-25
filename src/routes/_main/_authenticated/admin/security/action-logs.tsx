import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { BitacoraLogsScreen } from '@/app/features/bitacora'

export const Route = createFileRoute('/_main/_authenticated/admin/security/action-logs',)({
  component: () => (
      <PermissionGuard permission="ver_bitacora_acciones">
        <BitacoraLogsScreen />
      </PermissionGuard>
    ),
    staticData: {
      metaRoute: {
        title: 'Bitácora Acciones',
        icon: 'ClipboardPenLine',
        hidden: false
      }
    }
})

