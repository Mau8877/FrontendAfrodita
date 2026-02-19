import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, type LucideIcon } from 'lucide-react'

// 1. Definimos la interfaz para los sub-elementos (Hijos)
interface MenuItemChild {
  label: string
  to: string
}

// 2. Definimos la interfaz para el item principal
interface MenuItem {
  label: string
  icon: string
  to?: string      // Opcional porque si tiene hijos, el padre puede no tener link
  variant?: 'highlight'
  children?: MenuItemChild[]
}

// 3. Tipamos las Props del componente
interface SidebarItemProps {
  item: MenuItem
  icon: LucideIcon
}

export function SidebarItem({ item, icon: Icon }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Verificamos si tiene hijos de forma segura
  const hasChildren = !!(item.children && item.children.length > 0)

  // --- RENDERIZADO PARA LINKS DIRECTOS ---
  if (!hasChildren) {
    return (
      <Link 
        to={item.to || '#'} 
        activeProps={{ className: 'bg-secondary text-white shadow-md' }}
        inactiveProps={{ className: 'text-slate-700 hover:bg-white/40' }}
        className={`group flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all duration-200 
          ${item.variant === 'highlight' ? 'bg-white border-2 border-secondary text-secondary mb-2' : ''}`}
      >
        <Icon className="h-5 w-5 opacity-70 group-hover:opacity-100" />
        <span>{item.label}</span>
      </Link>
    )
  }

  // --- RENDERIZADO PARA PESTAÑAS COLAPSABLES ---
  return (
    <div className="space-y-1">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group flex items-center justify-between p-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-white/40 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 opacity-70 group-hover:opacity-100" />
          <span>{item.label}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Contenedor de sub-ítems */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="ml-9 mt-1 space-y-1 border-l-2 border-secondary/20 pl-3">
          {item.children?.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              activeProps={{ className: 'text-secondary font-extrabold translate-x-1' }}
              inactiveProps={{ className: 'text-slate-500 hover:text-secondary' }}
              className="block py-2 text-xs font-semibold transition-all duration-200"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}