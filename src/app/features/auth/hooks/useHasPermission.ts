import { sidebarApi } from '@/components/layout/sidebarAdmin/store'

export function useHasPermission(claveRequerida: string) {
  // Accedemos al estado actual de la consulta getSidebarMenu sin disparar un nuevo GET
  const { data } = sidebarApi.endpoints.getSidebarMenu.useQueryState()
  
  // Si no hay data o permisos en el caché, denegamos por defecto
  if (!data?.permissions) return false
  
  // Verificamos si la clave enviada por Django está en la lista
  return data.permissions.includes(claveRequerida)
}