import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { 
  LogOut, 
  Copy, 
  Check, 
  FlaskConical, 
  ShieldCheck, 
  ShieldAlert, 
  TableProperties, 
  Calendar 
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { type ColumnDef } from '@tanstack/react-table'

// --- IMPORTS DE LA ARQUITECTURA ---
import { logout } from '@/app/features/auth/store/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLazyGetProtectedDataQuery } from '../store'
import { type RootState } from '@/app/store'
import { LoaderAfrodita } from '@/components/LoaderAfrodita'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'

// ==========================================
// 🧪 DATOS DE PRUEBA PARA MAURO
// ==========================================
type TestUser = {
  id: string
  nombre: string
  email: string
  rol: string
  estado: string
}

const testColumns: ColumnDef<TestUser>[] = [
  { 
    accessorKey: "nombre", 
    header: "Nombre",
    enableSorting: false, // Bloqueado
  },
  {
    accessorKey: "email",
    header: "Correo",
    enableSorting: true,
  },
  { 
    accessorKey: "rol", 
    header: "Rol",
    enableSorting: true, // Activo para probar combinación
  },
  { 
    accessorKey: "estado", 
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
          estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {estado}
        </span>
      )
    }
  }
]

const testData: TestUser[] = [
  { id: "1", nombre: "Mauro", email: "mauro@afrodita.com", rol: "Super Admin", estado: "Activo" },
  { id: "2", nombre: "Tatiana", email: "tati@afrodita.com", rol: "Admin", estado: "Activo" },
  { id: "3", nombre: "Toji Fushiguro", email: "toji@inventario.com", rol: "Almacen", estado: "Inactivo" },
  { id: "4", nombre: "Farid Dieck", email: "farid@ventas.com", rol: "Vendedor", estado: "Activo" },
]

export function DashboardScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  // 1. ESTADO GLOBAL
  const authState = useSelector((state: RootState) => state.auth)

  // 2. HOOKS DE API
  const [triggerTest, { data: testDataAPI, isFetching, error: testError }] = useLazyGetProtectedDataQuery()

  const tokenSignature = authState.token ? authState.token.slice(-8) : 'NULO'

  // --- HANDLERS ---
  const handleLogout = () => {
    dispatch(logout())
    navigate({ to: '/login' })
  }

  const handleFakeRefresh = () => {
    setIsRefetching(true)
    setTimeout(() => {
      setIsRefetching(false)
      toast.success("Sincronización completada")
    }, 1200)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(authState, null, 2))
    setCopied(true)
    toast.success("JSON copiado al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestToken = async () => {
    try {
      await triggerTest().unwrap()
      toast.success("Token validado correctamente")
    } catch {
      toast.error("Error de autenticación")
    }
  }

  // Handlers para las acciones (Inyectan los 4 iconos en la DataTable)
  const onView = (user: TestUser) => toast.info(`Visibilidad de ${user.nombre} actualizada`);
  const onDetail = (user: TestUser) => toast.success(`Abriendo bitácora de: ${user.nombre}`);
  const onEdit = (user: TestUser) => toast.warning(`Editando usuario: ${user.nombre}`);
  const onDelete = (user: TestUser) => toast.error(`Eliminando registro: ${user.nombre}`);
  const onAdd = () => toast.info("Abriendo modal de registro...");

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-header">
              Dashboard de Depuración 🐛
            </h1>
            <p className="text-slate-500">
              Sesión activa: <span className="font-bold text-secondary">{authState.user?.username || 'Mauro'}</span>
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="shadow-sm">
            <LogOut className="mr-2 h-4 w-4" />
            Salir del sistema
          </Button>
        </div>

        {/* LABORATORIO DE TOKENS */}
        <Card className="border-blue-200 shadow-sm bg-blue-50/30 overflow-hidden">
          <CardHeader className="border-b border-blue-100 bg-white/50">
            <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
              <FlaskConical className="h-5 w-5" />
              Laboratorio de Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-5 rounded-xl border border-blue-100">
                <p className="text-2xl font-mono font-black text-blue-600">...{tokenSignature}</p>
                <Button onClick={handleTestToken} disabled={isFetching} className="bg-blue-600 hover:bg-blue-700 min-w-[200px]">
                  {isFetching ? "Validando..." : "⚡ Test JWT"}
                </Button>
             </div>
          </CardContent>
        </Card>

        {/* ── SECCIÓN DE TABLA MAESTRA ── */}
        <Card className="border-primary/20 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-primary/10 border-b border-primary/20 p-4">
            <CardTitle className="text-sm font-black uppercase text-primary flex items-center gap-2 tracking-widest">
              <TableProperties className="h-4 w-4" />
              Gestión Administrativa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <DataTable 
              columns={testColumns} 
              data={testData} 
              onRefresh={handleFakeRefresh} 
              isFetching={isRefetching}
              // Activación de Iconos
              onView={onView}
              onDetail={onDetail}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          </CardContent>
        </Card>

        {/* MONITOR DE REDUX */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b p-4">
            <CardTitle className="text-xs font-black text-slate-700 uppercase tracking-widest">Store Monitor</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-7 text-[10px] font-black border-slate-300 hover:bg-white uppercase">
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1.5">Copiar Store</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="bg-slate-900 text-emerald-400 p-6 overflow-x-auto text-[12px] font-mono leading-relaxed max-h-[350px] custom-scrollbar">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* FEEDBACK DE CARGA/ERRORES */}
        <Card className="border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          <CardHeader className="bg-slate-50/50 border-b p-4">
            <CardTitle className="text-xs font-black uppercase text-slate-700 tracking-widest">
              QA: Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative flex-1 min-h-[350px]">
            <LoaderAfrodita 
              message="Simulación de error: El dealer tiene 21" 
              hasError={true} 
            />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}