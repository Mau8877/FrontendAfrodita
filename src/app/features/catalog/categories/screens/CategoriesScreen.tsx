import { Tags } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

export const CategoriesScreen = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader 
        title="Gestionar Categorías" 
        icon={Tags} 
        breadcrumbs={[ { label: "Catalog" }, { label: "Categories_Management" } ]} 
      />
    </div>
  )
}