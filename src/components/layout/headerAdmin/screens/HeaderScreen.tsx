import { SidebarControl } from '../components/SidebarControl'
import { BrandLogo } from '../components/BrandLogo'
import { UserActions } from '../components/UserActions'

export function HeaderScreen() {
  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-header border-b border-black/5 shadow-sm transition-colors duration-300">
      <div className="h-full px-4 md:px-6 flex items-center justify-between max-w-[1440px] mx-auto">
        
        {/* IZQUIERDA: Botón Hamburguesa (SOLO MÓVIL) */}
        <div className="w-1/3 flex justify-start">
           {/* lg:hidden hace que desaparezca en pantallas grandes donde el sidebar ya es fijo */}
           <div className="lg:hidden text-secondary"> 
             <SidebarControl />
           </div>
        </div>

        {/* CENTRO: Logo */}
        <div className="w-1/3 flex justify-center">
           <BrandLogo />
        </div>

        {/* DERECHA: Acciones */}
        <div className="w-1/3 flex justify-end">
           <UserActions />
        </div>

      </div>
    </header>
  )
}