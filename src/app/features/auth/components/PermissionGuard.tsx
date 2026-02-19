import { type ReactNode } from 'react'
import { useHasPermission } from '../hooks/useHasPermission'
import { AccessDenied } from './AccessDenied'
import { sidebarApi } from '@/components/layout/sidebarAdmin/store'
import { Navigate } from '@tanstack/react-router' 

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode 
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { isLoading, isError } = sidebarApi.endpoints.getSidebarMenu.useQuery(undefined);
  const hasAccess = useHasPermission(permission);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" />;
  }

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    return <AccessDenied />;
  }

  return <>{children}</>;
}