import { createFileRoute } from '@tanstack/react-router';
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard';
import { ReporteVentaPorSucursalScreen } from '@/app/features/reports';

export const Route = createFileRoute('/_main/_authenticated/admin/reports/ventas-sucursal')({
  component: () => (
    <PermissionGuard permission="ver_reportes_ventas_sucursal">
      <ReporteVentaPorSucursalScreen />
    </PermissionGuard>
  ),
});

