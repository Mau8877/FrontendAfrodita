// 📜 sidebarAdmin/screens/SidebarScreen.tsx
import { SidebarContent } from '../components/SidebarContent'

export function SidebarScreen() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-full overflow-hidden shrink-0">
      <div className="p-6 shrink-0"> {/* shrink-0 para que el título no se aplaste */}
        <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest">Panel</span>
        <h2 className="text-sm font-black text-slate-800">Administración</h2>
      </div>
      
      {/* Solo esta parte hace scroll si hay 100 items */}
      <div className="flex-1 overflow-y-auto px-3 pb-10 custom-scrollbar">
        <SidebarContent />
      </div>
    </aside>
  )
}