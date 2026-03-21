import { createFileRoute } from '@tanstack/react-router'
import { CatalogScreen } from '@/app/features/client/catalog'
import { type CatalogFilters as IFilters } from '@/app/features/client/catalog/types'

export const Route = createFileRoute('/_main/_client/catalog/')({
  validateSearch: (search: Record<string, unknown>): IFilters => {
    return {
      page: Number(search?.page) || 1,
      search: (search?.search as string) || '',
      tipo: (search?.tipo as string) || undefined,
      marca: (search?.marca as string) || undefined,
      categoria: (search?.categoria as string) || undefined,
      tonos: (search?.tonos as string) || undefined,
    }
  },
  component: () => <CatalogScreen />,
  staticData: {
    metaRoute: {
      title: 'Catálogo de Productos',
    }
  } 
})