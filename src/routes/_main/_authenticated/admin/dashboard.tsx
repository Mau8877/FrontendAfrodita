import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'

export const Route = createFileRoute('/_main/_authenticated/admin/dashboard')({
  component: () => (
    <PermissionGuard permission="ver_dashboard">
      <DashboardScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Dashboard',
      icon: null,
      hidden: true
    }
  }
})