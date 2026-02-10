import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// --- IMPORTS ---
import { logout } from '@/app/features/auth/store/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Importamos el tipo del estado raíz para que TypeScript no se queje
import { type RootState } from '@/app/store'

export function DashboardScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // 1. OBTENEMOS TODO EL ESTADO DE AUTH 📦
  // Esto trae: user, token (access), refreshToken, isAuthenticated, etc.
  const authState = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate({ to: '/login' })
  }

  const copyToClipboard = () => {
    // Copiamos el JSON formateado al portapapeles
    navigator.clipboard.writeText(JSON.stringify(authState, null, 2))
    setCopied(true)
    toast.success("Estado copiado al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard de Depuración 🐛</h1>
            <p className="text-slate-500">
              Bienvenido, <span className="font-bold text-blue-600">{authState.user?.username || 'Usuario'}</span>
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* VISOR DE ESTADO (REDUMP) */}
        <Card className="border-slate-300 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b">
            <CardTitle className="text-lg font-mono">Estado Actual (Redux Store)</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2">{copied ? "Copiado" : "Copiar JSON"}</span>
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Aquí ocurre la magia visual */}
            <pre className="bg-slate-950 text-green-400 p-6 overflow-auto text-sm font-mono max-h-[500px] rounded-b-lg">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* EXPLICACIÓN RÁPIDA DE LO QUE VES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="font-bold text-sm text-gray-500">ACCESS TOKEN</h3>
            <p className="text-xs break-all mt-1 text-gray-800">
              {authState.token ? `${authState.token.substring(0, 20)}...` : 'Nulo'}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="font-bold text-sm text-gray-500">REFRESH TOKEN</h3>
            <p className="text-xs break-all mt-1 text-gray-800">
              {authState.refreshToken ? `${authState.refreshToken.substring(0, 20)}...` : 'Nulo'}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="font-bold text-sm text-gray-500">USER ID</h3>
            <p className="text-xs break-all mt-1 text-gray-800">
              {authState.user?.user_id || 'Nulo'}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}