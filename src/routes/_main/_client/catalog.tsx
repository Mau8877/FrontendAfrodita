import { createFileRoute } from '@tanstack/react-router'
import { CatalogScreen } from '@/app/features/client/catalog'

export const Route = createFileRoute('/_main/_client/catalog')({
  component: () => (
      <CatalogScreen />
    ),
    staticData: {
      metaRoute: {
        title: 'Catálogo de Productos',
      }
    } 
})

