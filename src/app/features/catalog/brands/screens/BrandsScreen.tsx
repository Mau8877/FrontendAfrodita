import { Badge } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

export const BrandsScreen = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Marcas" 
        icon={Badge} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Brands_Management" } ]} 
      />
    </div>
  )
}