import { createFileRoute } from '@tanstack/react-router'
import { AccessDenied } from '@/app/features/auth/components/AccessDenied'

export const Route = createFileRoute('/_main/$')({
  component: () => <AccessDenied />,
})