import { SidebarControl } from '../components/SidebarControl'
import { SearchBar } from '../components/SearchBar'
import { BrandLogo } from '../components/BrandLogo'
import { UserActions } from '../components/UserActions'

export function HeaderScreen() {
  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white border-b border-slate-200">
      <div className="h-full px-4 flex items-center justify-between relative max-w-[1440px] mx-auto">
        
        {/* Lado izquierdo: Buscador Admin */}
        <div className="flex items-center w-1/3">
          <SearchBar /> 
        </div>

        {/* Centro: Logo */}
        <BrandLogo />

        {/* Lado derecho: Pill + User + Botón Sidebar */}
        <div className="flex items-center justify-end gap-2 w-1/3">
          <UserActions />
          <div className="border-l pl-2 ml-2">
             <SidebarControl /> {/* El botón que abre el sidebar derecho */}
          </div>
        </div>

      </div>
    </header>
  )
}