import { LucideIcon } from 'lucide-react'

// Extendemos la interfaz oficial de TanStack Router
declare module '@tanstack/react-router' {
  interface StaticData {
    metaRoute?: {
      title: string        // Nombre para el Menú Lateral
      icon?: LucideIcon    // Icono visual
      order?: number       // Para ordenar el menú (1, 2, 3...)
      hidden?: boolean     // true si no quieres que salga en el menú
      roles?: string[]     // (Opcional) Roles permitidos ['admin', 'user']
    }
  }
}