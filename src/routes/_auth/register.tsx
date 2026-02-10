import { createFileRoute } from '@tanstack/react-router'
import { RegisterScreen } from '@/app/features/auth'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterScreen,
  staticData: {
    metaRoute: {
      title: 'Registrarse',
      icon: null,
      hidden: true
    }
  }
})