import { createFileRoute } from '@tanstack/react-router'
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard'
import { PaymentMethodScreen } from '@/app/features/config'

export const Route = createFileRoute(
  '/_main/_authenticated/admin/config/payment-method',
)({
  component: () => (
    <PermissionGuard permission="gestionar_metodo_pago">
      <PaymentMethodScreen />
    </PermissionGuard>
  ),
  staticData: {
    metaRoute: {
      title: 'Gestionar Métodos de Pago',
      icon: 'QrCode',
      hidden: false
    }
  }
})

