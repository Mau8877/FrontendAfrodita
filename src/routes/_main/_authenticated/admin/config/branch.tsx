import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/config/branch',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/_authenticated/admin/config/branch"!</div>
}
