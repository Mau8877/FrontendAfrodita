import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, Copy, Check, FlaskConical, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// --- IMPORTS ---
import { logout } from '@/app/features/auth/store/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useLazyGetProtectedDataQuery } from '../store'
import { type RootState } from '@/app/store'

export function DashboardScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // 1. OBTENEMOS EL ESTADO (Ya corregido en el slice)
  const authState = useSelector((state: RootState) => state.auth)

  // 2. OBTENEMOS EL HOOK DE PRUEBA
  const [triggerTest, { data: testData, isFetching, error: testError }] = useLazyGetProtectedDataQuery()

  // Helper para ver solo la firma del token
  const tokenSignature = authState.token 
    ? authState.token.slice(-8) 
    : 'NULO'

  const handleLogout = () => {
    dispatch(logout())
    navigate({ to: '/login' })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(authState, null, 2))
    setCopied(true)
    toast.success("Estado copiado")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestToken = async () => {
    try {
      await triggerTest().unwrap()
      toast.success("Solicitud exitosa (Token Válido)")
    } catch {
      toast.error("Error: Token inválido o expirado")
    }
  }

  return (
    /* QUITAMOS: min-h-screen y p-8 (el padding ya lo da el main del layout).
       USAMOS: w-full para que se adapte al contenedor padre.
    */
    <div className="w-full">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="flex justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard de Depuración 🐛
            </h1>
            <p className="text-slate-500">
              Bienvenido, <span className="font-bold text-secondary">{authState.user?.username || 'Usuario'}</span>
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="shadow-sm">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* --- LABORATORIO DE TOKENS --- */}
        <Card className="border-blue-200 shadow-sm bg-blue-50/30 overflow-hidden">
          <CardHeader className="border-b border-blue-100 bg-white/50">
            <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
              <FlaskConical className="h-5 w-5" />
              Laboratorio de Tokens
            </CardTitle>
            <CardDescription className="text-blue-600/70">
              Verifica la validación y el refresco automático de tus credenciales JWT.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-5 rounded-xl border border-blue-100 shadow-inner">
              <div className="text-center md:text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                  Firma del Token Actual
                </p>
                <p className="text-2xl font-mono font-black text-blue-600 tracking-wider">
                  ...{tokenSignature}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  (Cambia automáticamente al refrescarse)
                </p>
              </div>

              <Button 
                size="lg" 
                onClick={handleTestToken} 
                disabled={isFetching} 
                className="bg-blue-600 hover:bg-blue-700 min-w-[220px] h-12 rounded-full font-bold transition-all active:scale-95"
              >
                {isFetching ? "Verificando..." : "⚡ Probar Ruta Protegida"}
              </Button>
            </div>

            {/* Alertas de Respuesta */}
            <div className="space-y-2">
              {testData && (
                <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg font-medium animate-in slide-in-from-top-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm">Respuesta Backend: <code className="font-bold">"{testData.message}"</code></span>
                </div>
              )}
              {testError && (
                <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 px-4 py-3 rounded-lg font-medium animate-in slide-in-from-top-2">
                  <ShieldAlert className="h-5 w-5" />
                  <span className="text-sm">Error: El token ha expirado y el refresco falló.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- VISOR REDUX --- */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b p-4">
            <div className="flex flex-col">
              <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-tight">Estado Global</CardTitle>
              <CardDescription className="text-[10px]">Depuración en tiempo real de Redux Persist</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 text-xs font-bold border-slate-300 hover:bg-white">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="ml-2">{copied ? "¡Listo!" : "Copiar JSON"}</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="bg-slate-900 text-emerald-400 p-6 overflow-x-auto text-[13px] font-mono leading-relaxed max-h-[450px] custom-scrollbar">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}