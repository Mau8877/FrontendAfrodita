import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { VentasScreen } from '@/app/features/pos'

export const Route = createFileRoute('/_main/_authenticated/admin/sales/pos')({
  component: () => (
    <PermissionGuard permission="registrar_venta">
      <VentasScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Registrar Venta',
      icon: 'PackageCheck',
      hidden: false
    }
  }
})
