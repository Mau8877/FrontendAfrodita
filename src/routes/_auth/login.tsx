import { createFileRoute } from '@tanstack/react-router'
import { LoginScreen } from '@/app/features/auth'
import { LogIn } from 'lucide-react'

export const Route = createFileRoute('/_auth/login')({
  component: LoginScreen,
  staticData: {
    metaRoute: {
      title: 'Iniciar Sesión',
      icon: LogIn,
      hidden: true
    }
  }
})