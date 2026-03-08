import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { ShippingRateScreen } from '@/app/features/config'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/config/shipping-rate',
)({
  component: () => (
    <PermissionGuard permission="gestionar_tarifa_envio">
      <ShippingRateScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Tarifas de Envío',
      icon: 'Map',
      hidden: false
    }
  }  
})

