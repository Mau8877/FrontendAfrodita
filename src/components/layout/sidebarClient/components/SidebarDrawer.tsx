import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from '@/app/store'
import { close } from '../store/sidebarSlice'
import { SidebarContent } from './SidebarContent'

export function SidebarDrawer() {
  const dispatch = useDispatch()
  const { isOpen } = useSelector((state: RootState) => state.sidebarClient)

  const handleClose = () => dispatch(close())

  return (
    <div className={`fixed inset-0 z-40 transition-all ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Fondo: Menos oscuro (10%) y desenfoque mínimo */}
      <div 
        className={`absolute inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Panel blanco */}
      <div className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <SidebarContent onItemClick={handleClose} />
      </div>
    </div>
  )
}