import { createFileRoute } from '@tanstack/react-router';
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard';
import { ReporteProductoMasVendidoScreen } from '@/app/features/reports';

export const Route = createFileRoute('/_main/_authenticated/admin/reports/productos-mas-vendidos')({
  component: () => (
    <PermissionGuard permission="ver_reportes_productos_mas_vendidos">
      <ReporteProductoMasVendidoScreen />
    </PermissionGuard>
  ),
});

