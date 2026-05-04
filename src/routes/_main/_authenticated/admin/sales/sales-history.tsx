import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { HistorialVentasScreen } from '@/app/features/sales/historial-ventas'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/sales/sales-history',
)({
  component: () => (
    <PermissionGuard permission="ver_historial_ventas">
      <HistorialVentasScreen />
    </PermissionGuard>
  ),
})
