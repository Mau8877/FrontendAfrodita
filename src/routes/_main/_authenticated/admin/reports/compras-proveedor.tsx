import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/reports/compras-proveedor',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_main/_authenticated/admin/reports/compras-proveedor"!</div>
  )
}
