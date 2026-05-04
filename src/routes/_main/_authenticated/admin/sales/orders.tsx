import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { PedidosScreen } from '@/app/features/sales/pedidos'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/sales/orders',
)({
  component: () => (
    <PermissionGuard permission="gestionar_pedidos">
      <PedidosScreen />
    </PermissionGuard>
  ),
})
