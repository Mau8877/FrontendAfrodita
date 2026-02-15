import { Menu } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { toggle } from '@/components/layout/sidebarClient/store/sidebarSlice' 

export function SidebarControl() {
  const dispatch = useDispatch()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => dispatch(toggle())} 
      className="relative z-50"
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
}