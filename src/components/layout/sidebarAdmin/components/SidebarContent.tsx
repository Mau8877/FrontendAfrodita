import { useGetSidebarMenuQuery } from '../store'
import { iconMap } from './icons'
import { SidebarItem } from './SidebarItem'
import { LayoutDashboard } from 'lucide-react'
import { authSelectors } from '@/app/features/auth/store'
import { useSelector } from 'react-redux'

interface MenuItem {
  label: string
  icon: string
  to?: string
  variant?: 'highlight'
  children?: {
    label: string
    to: string
    icon?: string
  }[]
}

interface SidebarResponse {
  menu: MenuItem[]
  permissions: string[]
}

export function SidebarContent() {
  const isAuthenticated = useSelector(authSelectors.isAuthenticated)

  const { data, isLoading } = useGetSidebarMenuQuery(undefined, {
    skip: !isAuthenticated,
  }) as { data: SidebarResponse | undefined, isLoading: boolean }

  if (!isAuthenticated) return null
  if (isLoading) return <div className="p-4 animate-pulse text-xs text-secondary/50">Cargando...</div>

  return (
    <nav className="space-y-2 px-3 custom-scrollbar">
      {data?.menu.map((item: MenuItem) => (
        <SidebarItem 
          key={item.label} 
          item={item}
          icon={iconMap[item.icon] || LayoutDashboard} 
        />
      ))}
    </nav>
  )
}