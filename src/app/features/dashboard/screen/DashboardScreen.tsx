import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, LayoutGrid, Package } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { logout } from '@/app/features/auth/store/authSlice'
import { Button } from '@/components/ui/button'
import { type RootState } from '@/app/store'
import { DataCardTable } from '@/components/ui/data-card-table'
import { type Product } from '@/app/features/catalog/products/types'
import { ProductCardItem } from '@/components/ProductCardItem'

// --- DATA TEST ---
const testProducts: Product[] = [

  {

    id: "1", nombre: "Ray-Ban Aviator Classic Gold", sku: "RB-3025-G", precio_venta: "159.99", stock_minimo: 12, is_visible: true,

    nombre_marca: "Ray-Ban", nombre_categoria: "Sol", nombre_tipo: "Lentes",

    colores: [{ id: "c1", nombre: "Gold", codigo_hex: "#D4AF37" }, { id: "c2", nombre: "Black", codigo_hex: "#000000" }],

    imagenes: [

      { id: "i1", imagen: "https://images.ray-ban.com/is/image/RayBan/805289602057__002.png", es_principal: true },

      { id: "i2", imagen: "https://images.ray-ban.com/is/image/RayBan/805289602057__001.png", es_principal: false }

    ],

    created_at: "", updated_at: "", deleted_at: null, id_marca: "", id_categoria: "", id_tipo: ""

  },

  {

    id: "2", nombre: "Oakley Holbrook Prizm Sapphire", sku: "OK-9102-S", precio_venta: "210.00", stock_minimo: 8, is_visible: false,

    nombre_marca: "Oakley", nombre_categoria: "Sport", nombre_tipo: "Lentes",

    colores: [{ id: "c3", nombre: "Blue", codigo_hex: "#0000FF" }],

    imagenes: [

      { id: "i3", imagen: "https://assets.oakley.com/is/image/Oakley/888392102140__001.png", es_principal: true },

      { id: "i4", imagen: "https://assets.oakley.com/is/image/Oakley/888392102140__002.png", es_principal: false }

    ],

    created_at: "", updated_at: "", deleted_at: null, id_marca: "", id_categoria: "", id_tipo: ""

  },

  ...Array.from({ length: 2 }).map((_, i) => ({

    id: `id-${i + 3}`, nombre: `Modelo Pro Black Edition ${i + 1}`, sku: `SKU-AFR-00${i}`, precio_venta: "125.00", stock_minimo: 5, is_visible: true,

    nombre_marca: "Afrodita", nombre_categoria: "Vista", nombre_tipo: "Armazón",

    colores: [{ id: "cx", nombre: "Negro", codigo_hex: "#1a1a1a" }],

    imagenes: [{ id: "ix", imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop", es_principal: true }],

    created_at: "", updated_at: "", deleted_at: null, id_marca: "", id_categoria: "", id_tipo: ""

  }))

]

export function DashboardScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isRefetching, setIsRefetching] = useState(false)
  const authState = useSelector((state: RootState) => state.auth)

  return (
    <div className="w-full p-8 bg-slate-50/20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-primary/5 rounded-3xl flex items-center justify-center text-primary border border-primary/5">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Lab Afrodita</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1.5">Visual Identity Debug</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => { dispatch(logout()); navigate({ to: '/login' }) }} className="rounded-2xl font-black uppercase text-[10px] text-rose-500 hover:bg-rose-50 px-6">
            <LogOut className="mr-2 h-4 w-4" /> Salir
          </Button>
        </div>

        <DataCardTable 
          columns={[{ accessorKey: "nombre" }]} 
          data={testProducts} 
          onRefresh={() => { setIsRefetching(true); setTimeout(() => setIsRefetching(false), 1000) }}
          isFetching={isRefetching}
          totalRecords={testProducts.length}
          renderCard={(product) => (
            <ProductCardItem 
              product={product as Product} 
              onEdit={(p) => toast.warning(`Editando ${p.nombre}`)}
              onDelete={(p) => toast.error(`Eliminando ${p.sku}`)}
            />
          )}
        />
      </div>
    </div>
  )
}