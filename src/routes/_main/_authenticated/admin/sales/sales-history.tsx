import { createFileRoute } from '@tanstack/react-router'
import { HistorialVentasScreen } from '@/app/features/sales/historial-ventas'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/sales/sales-history',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <HistorialVentasScreen />
}
