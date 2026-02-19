// 📜 headerAdmin/components/SidebarControl.tsx
import { useDispatch } from 'react-redux'
import { toggle } from '@/components/layout/sidebarAdmin'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SidebarControl() {
  const dispatch = useDispatch()
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => dispatch(toggle())}
      className="text-secondary hover:bg-white/20"
    >
      <Menu className="h-6 w-6" strokeWidth={2.5} />
    </Button>
  )
}