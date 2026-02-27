import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '@/app/store'
import { close } from '../store/sidebarSlice' 
import { X } from 'lucide-react'
import { SidebarContent } from './SidebarContent'

export function SidebarDrawer() {
  const isOpen = useSelector((state: RootState) => state.sidebarAdmin.isOpen)
  const dispatch = useDispatch()

  const handleClose = () => dispatch(close())

  return (
    <>
      {/* OVERLAY: Fondo oscuro con desenfoque suave */}
      <div 
        className={`
          fixed inset-0 bg-secondary/20 backdrop-blur-sm z-[998] transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={handleClose}
      />

      {/* SIDEBAR: Con el color bg-header/80 y efecto traslúcido */}
      <aside className={` 
        fixed top-0 left-0 h-screen w-[280px] z-[999] shadow-[10px_0_30px_-15px_rgba(0,0,0,0.2)]
        bg-header/80 backdrop-blur-md
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      `}>
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Panel</span>
            <h2 className="text-lg font-black text-slate-800">Administración</h2>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full text-slate-600 hover:text-secondary transition-all active:scale-90"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
        
        {/* Contenido con el scroll personalizado de Afrodita */}
        <div className="h-[calc(100vh-90px)] overflow-y-auto custom-scrollbar px-2 py-4">
          <SidebarContent onItemClick={handleClose} />
        </div>
      </aside>
    </>
  )
}