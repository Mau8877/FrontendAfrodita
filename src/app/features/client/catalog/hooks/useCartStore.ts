/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from "sonner"

// Definimos la estructura de un item en el carrito
interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen: string
  sku: string
  stock_disponible: number // Importante para validar localmente
}

interface CartState {
  items: CartItem[]
  // Acciones
  addItem: (product: any, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  // Getters (para la UI)
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // --- ACCIÓN: AÑADIR O ACTUALIZAR ITEM ---
      addItem: (product, quantity) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)
        
        // Validación de Stock Real (lo que viene de la API)
        const currentStock = product.stock_disponible ?? 0
        if (currentStock <= 0) {
          console.error("No hay stock disponible para este producto.")
          return
        }

        if (existingItem) {
          // Si ya existe, validamos que no supere el stock total al sumar
          const newQuantity = existingItem.cantidad + quantity
          if (newQuantity > currentStock) {
            toast.error("Límite de stock alcanzado", {
              description: `Lo sentimos, solo tenemos ${currentStock} unidades disponibles de este modelo.`,
              style: { 
                borderRadius: '1.5rem', 
                fontFamily: 'Poppins',
                backgroundColor: 'white'
              },
              classNames: {
                icon: 'text-rose-600', 
                description: '!text-slate-900 font-medium font-sans opacity-100',
                title: 'text-slate-950 font-bold'
              }
            })
            return
          }

          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, cantidad: newQuantity }
                : item
            ),
          })
        } else {
          // Si es un item nuevo, validamos que la cantidad inicial no sea mayor al stock
          if (quantity > currentStock) {
            toast.error("Stock insuficiente", {
              description: `Solo hay ${currentStock} unidades disponibles.`,
              style: { borderRadius: '1.5rem', fontFamily: 'Poppins' }
            })
            return
          }

          set({
            items: [
              ...items,
              {
                id: product.id,
                nombre: product.nombre,
                precio: Number(product.precio_venta),
                cantidad: quantity,
                imagen: product.imagenes?.[0]?.imagen || '',
                sku: product.sku,
                stock_disponible: currentStock,
              },
            ],
          })
        }
      },

      // --- ACCIÓN: ACTUALIZAR CANTIDAD (Para la página de pedidos) ---
      updateQuantity: (productId, quantity) => {
        const items = get().items
        const item = items.find(i => i.id === productId)
        
        if (item) {
          // Validamos contra el stock que guardamos al añadirlo
          if (quantity > item.stock_disponible) {
            toast.error("No hay más unidades", {
              description: `Ya alcanzaste el máximo disponible (${item.stock_disponible}).`,
              style: { 
                borderRadius: '1.5rem', 
                fontFamily: 'Poppins',
                backgroundColor: 'white'
              },
              classNames: {
                icon: 'text-rose-600', 
                description: '!text-slate-900 font-medium font-sans opacity-100',
                title: 'text-slate-950 font-bold'
              }
            })
            return
          }
          if (quantity <= 0) {
            get().removeItem(productId)
            return
          }

          set({
            items: items.map((i) =>
              i.id === productId ? { ...i, cantidad: quantity } : i
            ),
          })
        }
      },

      // --- ACCIÓN: ELIMINAR ITEM ---
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      // --- ACCIÓN: VACIAR CARRITO ---
      clearCart: () => set({ items: [] }),

      // --- GETTERS ÚTILES ---
      getTotal: () => {
        return get().items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.cantidad, 0)
      },
    }),
    {
      name: 'afrodita-cart-storage', // Nombre de la llave en LocalStorage
    }
  )
)