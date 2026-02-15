import { useDispatch } from 'react-redux'
import { toggle } from '../../sidebarAdmin/store/sidebarSlice'
import { Menu } from 'lucide-react'

export function SidebarControl() {
  const dispatch = useDispatch()
  return (
    <button 
      onClick={() => dispatch(toggle())}
      className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
    >
      <Menu className="h-6 w-6" />
    </button>
  )
}