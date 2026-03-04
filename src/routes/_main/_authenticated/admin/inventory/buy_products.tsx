import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { BuyProductsScreen } from '@/app/features/inventory'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/inventory/buy_products',
)({
  component: () => (
    <PermissionGuard permission="gestionar_compra_productos">
      <BuyProductsScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Reposición de Stock',
      icon: 'Receipt',
      hidden: false
    }
  } 
})
