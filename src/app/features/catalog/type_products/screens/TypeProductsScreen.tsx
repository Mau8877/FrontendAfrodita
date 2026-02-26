import { Layers } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

export const TypeProductsScreen = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Tipo Productos" 
        icon={Layers} 
        breadcrumbs={[ { label: "Catalog" }, { label: "type_management" } ]} 
      />
    </div>
  )
}