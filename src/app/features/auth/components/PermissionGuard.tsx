import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { authSelectors } from '@/app/features/auth/store'
import { useHasPermission } from '../hooks/useHasPermission'
import { AccessDenied } from './AccessDenied'
import { sidebarApi } from '@/components/layout/sidebarAdmin/store'
import { Navigate, useNavigate } from '@tanstack/react-router' 
import { LoaderAfrodita } from '@/components/LoaderAfrodita'

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode 
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const isAuthenticated = useSelector(authSelectors.isAuthenticated);
  const navigate = useNavigate();

  // 1. Extraemos 'error' del hook de RTK Query
  const { isLoading, isError, error } = sidebarApi.endpoints.getSidebarMenu.useQuery(undefined, {
    skip: !isAuthenticated,
  });

  const hasAccess = useHasPermission(permission);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <LoaderAfrodita message="Cargando Permisos" />;
  }

  if (isError) {
    // 2. Lógica para interceptar y extraer el mensaje del backend
    let errorMessage = "Error de conexión"; // Fallback por defecto si se cae el internet
    
    if (error) {
      if ('data' in error && error.data && typeof error.data === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorData = error.data as Record<string, any>;
        errorMessage = errorData.message || errorData.detail || "Error interno del servidor";
      } 
      else if ('error' in error) {
        const rawError = String(error.error);
        if (rawError.includes("Failed to fetch") || rawError.includes("Network Error")) {
          errorMessage = "Servidor Inaccesible";
        } else {
          errorMessage = rawError;
        }
      }
    }

    return (
      <div className="relative h-full w-full min-h-[400px]">
        {/* 3. Le pasamos el mensaje real al ojo de Afrodita */}
        <LoaderAfrodita 
          message={errorMessage} 
          hasError={true} 
        />
        {/* Botón superpuesto para no dejar al usuario atrapado */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in delay-700 duration-500">
          <button 
            onClick={() => navigate({ to: '/login' })}
            className="px-6 py-2 text-xs font-bold tracking-widest text-red-500 border border-red-500/50 rounded-full hover:bg-red-500/10 transition-colors uppercase"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    return <AccessDenied />;
  }

  return <>{children}</>;
}