import { PackageOpen } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

export const ProductManagementScreen = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Productos" 
        icon={PackageOpen} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Product_Management" } ]} 
      />
    </div>
  )
}