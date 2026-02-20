import { ChevronRight, type LucideIcon, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string 
}

interface PageHeaderProps {
  title: string
  icon: LucideIcon
  breadcrumbs: BreadcrumbItem[]
}

export const PageHeader = ({ title, icon: Icon, breadcrumbs }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-1.5 mb-6 w-full overflow-hidden">
      {/* TÍTULO CON ICONO - Ajuste de tamaño en móviles */}
      <div className="flex items-center gap-2 text-primary">
        <Icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter truncate">
          {title}
        </h1>
      </div>
      
      {/* RUTA (BREADCRUMBS) - Scroll horizontal en móviles */}
      <nav className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
        <div className="flex items-center gap-1 hover:text-secondary transition-colors cursor-default flex-shrink-0">
          <Home className="w-3 h-3" />
          <span className="hidden sm:inline">Admin</span>
        </div>
        
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-300 flex-shrink-0" />
            <span className={
              index === breadcrumbs.length - 1 
                ? "text-secondary bg-secondary/10 px-2 py-0.5 rounded" 
                : ""
            }>
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  )
}