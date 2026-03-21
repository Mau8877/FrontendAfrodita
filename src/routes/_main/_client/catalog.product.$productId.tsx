import { createFileRoute } from '@tanstack/react-router'
import { CatalogProductDetailScreen } from '@/app/features/client/catalog'

export const Route = createFileRoute('/_main/_client/catalog/product/$productId')({
  component: CatalogProductDetailScreen,
})


