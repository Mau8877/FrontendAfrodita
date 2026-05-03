import { createFileRoute } from '@tanstack/react-router'
import { PedidosScreen } from '@/app/features/sales/pedidos'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/sales/orders',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <PedidosScreen />
}
