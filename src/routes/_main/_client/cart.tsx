import { createFileRoute } from '@tanstack/react-router'
import { CartScreen } from '@/app/features/client'

export const Route = createFileRoute('/_main/_client/cart')({
  component: () => <CartScreen />,
    staticData: {
      metaRoute: {
        title: 'Carrito',
      }
    } 
})