import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '@/app/store'
import { close } from '../store/sidebarSlice' // Usamos close para el overlay
import { X } from 'lucide-react'
import { SidebarContent } from './SidebarContent'

export function SidebarDrawer() {
  // Cambia esto por el nombre exacto de tu slice en el RootState
  const isOpen = useSelector((state: RootState) => state.sidebarAdmin.isOpen)
  const dispatch = useDispatch()

  return (
    <>
      {/* OVERLAY: Blur sutil para que resalte el panel */}
      <div 
        className={`
          fixed inset-0 bg-black/30 backdrop-blur-sm z-[998] transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={() => dispatch(close())}
      />

      {/* SIDEBAR: Desde la derecha */}
      <aside className={`
        fixed top-0 right-0 h-screen w-[300px] bg-white z-[999] shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.3)]
        transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Panel</span>
            <h2 className="text-lg font-black text-slate-800">Administración</h2>
          </div>
          <button 
            onClick={() => dispatch(close())}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-secondary transition-all shadow-sm active:scale-90"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
        
        {/* Contenido con Scroll si hay muchos items */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          <SidebarContent />
        </div>
      </aside>
    </>
  )
}