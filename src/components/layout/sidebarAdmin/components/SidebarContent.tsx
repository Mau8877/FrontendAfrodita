import { useGetSidebarMenuQuery } from '../store'
import { iconMap } from './icons'
import { SidebarItem } from './SidebarItem'
import { LayoutDashboard } from 'lucide-react'

interface MenuItem {
  label: string
  icon: string
  to?: string
  variant?: 'highlight'
  children?: {
    label: string
    to: string
  }[]
}

interface SidebarResponse {
  menu: MenuItem[]
  permissions: string[]
}

export function SidebarContent() {
  const { data, isLoading } = useGetSidebarMenuQuery() as { data: SidebarResponse | undefined, isLoading: boolean }

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