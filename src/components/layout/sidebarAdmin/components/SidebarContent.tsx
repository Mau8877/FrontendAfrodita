import { Users, Package, LayoutDashboard, Settings } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Users, label: 'Gestionar Usuarios', to: '/admin/users' },
  { icon: Package, label: 'Gestionar Productos', to: '/admin/products' },
  { icon: Settings, label: 'Configuración', to: '/admin/settings' },
]

export function SidebarContent() {
  return (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-secondary/10 hover:text-secondary transition-colors font-medium"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}