import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_client/faq')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/_client/faq"!</div>
}
