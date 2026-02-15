import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard'

export const Route = createFileRoute('/_main/_authenticated/dashboard')({
  component: DashboardScreen,
  staticData: {
    metaRoute: {
      title: 'Dashboard',
      icon: null,
      hidden: true
    }
  }
})