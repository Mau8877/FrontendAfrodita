import { createFileRoute } from '@tanstack/react-router';
import { PermissionGuard } from '@/app/features/auth/components/PermissionGuard';
import { ReporteComprasProveedorScreen } from '@/app/features/reports';

export const Route = createFileRoute('/_main/_authenticated/admin/reports/compras-proveedor')({
  component: () => (
    <PermissionGuard permission="ver_reportes_compras_proveedor">
      <ReporteComprasProveedorScreen />
    </PermissionGuard>
  ),
});

