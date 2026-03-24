import { SidebarControl } from '../components/SidebarControl'
import { BrandLogo } from '../components/BrandLogo'
import { UserActions } from '../components/UserActions'

export function HeaderScreen() {
  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-header border-b border-black/5 shadow-sm">
      <div className="h-full px-2 md:px-4 flex items-center justify-between relative max-w-[1440px] mx-auto">
        
        {/* IZQUIERDA: Ocupa un ancho fijo para no pisar el logo */}
        <div className="flex items-center gap-1 w-1/3 justify-start">
          <SidebarControl />
        </div>

        {/* CENTRO: Logo siempre centrado */}
        <BrandLogo />

        {/* DERECHA: Ocupa un ancho fijo */}
        <div className="flex items-center justify-end w-1/3">
          <UserActions />
        </div>

      </div>
    </header>
  )
}