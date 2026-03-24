import { createFileRoute } from '@tanstack/react-router'
import { CatalogScreen } from '@/app/features/client/catalog'
import { type CatalogFilters as IFilters } from '@/app/features/client/catalog/types'

// Le decimos a TypeScript que la URL va a manejar los filtros, EXCEPTO la página
type CatalogUrlSearch = Omit<IFilters, 'page'>;

export const Route = createFileRoute('/_main/_client/catalog/')({
  validateSearch: (search: Record<string, unknown>): CatalogUrlSearch => {
    return {
      // ¡Chau 'page'! Ya no existe en la URL
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