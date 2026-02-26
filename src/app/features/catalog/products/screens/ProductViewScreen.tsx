import { Package2 } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

export const ProductViewScreen = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Ver Productos" 
        icon={Package2} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Product_View" } ]} 
      />
    </div>
  )
}