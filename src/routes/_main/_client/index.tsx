import { createFileRoute } from '@tanstack/react-router'
import { HomeScreen } from '@/app/features/home' 
import { Home } from 'lucide-react' 

export const Route = createFileRoute('/_main/_client/')({
  component: HomeScreen, 
  staticData: {
    metaRoute: {
      title: 'Inicio',
      icon: Home,
      hidden: true 
    }
  }
})