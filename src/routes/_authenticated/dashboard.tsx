import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardScreen,
  staticData: {
    metaRoute: {
      title: 'Dashboard',
      icon: null, // Asegúrate de importar el ícono si lo usas
      hidden: true
    }
  }
})