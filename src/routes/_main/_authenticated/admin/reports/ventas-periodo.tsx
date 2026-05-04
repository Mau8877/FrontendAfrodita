import { createFileRoute } from '@tanstack/react-router';
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard';
import { ReporteVentaPorPeriodoScreen } from '@/app/features/reports';

export const Route = createFileRoute('/_main/_authenticated/admin/reports/ventas-periodo')({
  component: () => (
    <PermissionGuard permission="ver_reportes_ventas_periodo">
      <ReporteVentaPorPeriodoScreen />
    </PermissionGuard>
  ),
});

