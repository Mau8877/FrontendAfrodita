import { SidebarContent } from '../components/SidebarContent'

export function SidebarScreen() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-header/80 border-r border-black/5 h-full overflow-hidden shrink-0">
      
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-black/5">
        <span className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.3em]">Panel</span>
        <h2 className="text-xl font-black text-slate-800 italic tracking-tighter">Administración</h2>
      </div>
      
      {/* Contenido */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <SidebarContent />
      </div>

      {/* Footer decorativo Admin */}
      <div className="p-4 text-center">
         <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest">Afrodita System v1.0</p>
      </div>
    </aside>
  )
}