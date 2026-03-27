import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { iconMap } from './icons'

interface MenuItemChild {
  label: string
  to: string
  icon?: string
}

interface MenuItem {
  label: string
  icon: string
  to?: string
  variant?: 'highlight'
  children?: MenuItemChild[]
}

interface SidebarItemProps {
  item: MenuItem
  icon: LucideIcon
  onClick?: () => void
}

export function SidebarItem({ item, icon: Icon, onClick }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = !!(item.children && item.children.length > 0)

  const isHighlight = item.variant === 'highlight'

  // Estilo Base: Letras negras, sin fondo, transición suave
  const baseStyles = "group flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200"
  
  // Estilo para el Highlight: Solo un borde sutil y un fondo blanquecino muy tenue
  const highlightStyles = isHighlight 
    ? "border border-slate-200 bg-white/30 mb-2 shadow-sm hover:border-secondary/50" 
    : "hover:bg-white/40 mb-1"

  if (!hasChildren) {
    return (
      <Link 
        to={item.to || '#'}
        onClick={onClick}
        // Cuando está ACTIVO: Letras pasan a ser púrpuras (secondary) y el icono también
        activeProps={{ 
          className: 'text-secondary font-black bg-white/60 shadow-sm border-l-4 border-secondary rounded-l-none pl-2' 
        }}
        inactiveProps={{ 
          className: 'text-slate-900' 
        }}
        className={`${baseStyles} ${highlightStyles}`}
      >
        <Icon className={`h-5 w-5 transition-colors ${isHighlight ? 'text-slate-900 group-hover:text-secondary' : 'opacity-80 group-hover:text-secondary group-hover:opacity-100'}`} />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="space-y-1">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group flex items-center justify-between p-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] text-slate-900 hover:bg-white/40 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 opacity-80 group-hover:text-secondary group-hover:opacity-100" />
          <span>{item.label}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-4">
          {item.children?.map((child) => {
            const ChildIcon = child.icon ? iconMap[child.icon] : null;

            return (
              <Link
                key={child.to}
                to={child.to}
                onClick={onClick}
                activeProps={{ className: 'text-secondary font-black translate-x-1' }}
                inactiveProps={{ className: 'text-slate-500 hover:text-slate-900' }}
                className="flex items-center gap-2 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200"
              >
                {ChildIcon && <ChildIcon className="h-4 w-4 opacity-60" />}
                <span>{child.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}