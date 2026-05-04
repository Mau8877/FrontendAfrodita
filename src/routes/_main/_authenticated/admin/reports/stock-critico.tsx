import { createFileRoute } from '@tanstack/react-router';
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard';
import { ReporteStockCriticoScreen } from '@/app/features/reports';

export const Route = createFileRoute('/_main/_authenticated/admin/reports/stock-critico')({
  component: () => (
    <PermissionGuard permission="ver_reportes_stock_critico">
      <ReporteStockCriticoScreen />
    </PermissionGuard>
  ),
});

