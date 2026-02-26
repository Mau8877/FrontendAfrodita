import { Palette } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

export const ColorsScreen = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Colores" 
        icon={Palette} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Color_Management" } ]} 
      />
    </div>
  )
}