/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'

import { useLoginMutation } from '../store/loginApi'
import { loginSchema } from '../schemas/loginSchema'
import type { LoginFormValues } from '../schemas/loginSchema'
import type { ApiErrorResponse } from '../types'
import { api } from '@/app/store'
import { setCredentials } from '@/app/store/authSlice'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Importación directa del asset
import loginLogo from '@/assets/Login/LogoConNumero.png' 

export function LoginScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  
  const [login, { isLoading }] = useLoginMutation()

  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap()
      
      dispatch(api.util.resetApiState())
      dispatch(setCredentials(response.data))

      if (response.success) {
        // --- TOAST PERSONALIZADO CON NOMBRE ---
        const nombreUsuario = response.data.user.username || "Usuario"
        toast.success(`¡Bienvenido de nuevo, ${nombreUsuario}!`, {
          description: "Has iniciado sesión correctamente.",
          duration: 3000,
        })

        const userRole = response.data.user.rol
        const rolesAdmin = ['Super User', 'Admin', 'Vendedor']
        navigate({ to: rolesAdmin.includes(userRole) ? '/admin/dashboard' : '/' })
      }
    } catch (err: any) {
      const errorData = err.data as ApiErrorResponse | undefined
      
      triggerShake()

      toast.error(errorData?.message || "Credenciales inválidas", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        className: "bg-red-50 border-red-200 text-red-900 font-sans",
        duration: 4000,
      })

      if (errorData?.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          setError(field as keyof LoginFormValues, { type: 'manual', message: messages[0] })
        })
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden bg-white">
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      {/* BOTÓN VOLVER */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white md:text-white/70 hover:text-white transition-all bg-black/20 md:bg-transparent px-4 py-2 rounded-full backdrop-blur-md md:backdrop-blur-none"
      >
        <ArrowLeft size={14} strokeWidth={3} />
        Volver al inicio
      </Link>

      {/* BRANDING */}
      <div className="relative w-full md:w-1/2 min-h-[35vh] md:min-h-screen flex flex-col items-center justify-center p-12 bg-primary text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 400">
            <path d="M0,100 C150,200 250,0 400,100 L400,400 L0,400 Z" fill="white" fillOpacity="0.2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-40 md:w-64 bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <img src={loginLogo} alt="Afrodita Logo" className="w-full h-auto object-contain" />
          </div>
          <p className="max-w-[280px] font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs leading-relaxed">
            Resaltando la belleza de tu mirada con tecnología y elegancia
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className={`w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-20 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
        <div className="w-full max-w-[380px] space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter">
              Bienvenido
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <Input 
                {...register("email")}
                placeholder="Correo electrónico" 
                // Ahora usamos border-2 para que el rojo se note
                className={`h-14 rounded-full border-2 bg-slate-100 px-8 text-sm transition-all focus-visible:ring-offset-0 ${
                  errors.email 
                    ? "border-red-500 bg-red-50 focus-visible:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" 
                    : "border-transparent focus-visible:ring-primary/30"
                }`}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-6 italic">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <Input 
                  {...register("password")}
                  placeholder="Contraseña" 
                  type={showPassword ? "text" : "password"}
                  className={`h-14 rounded-full border-2 bg-slate-100 px-8 text-sm transition-all focus-visible:ring-offset-0 ${
                    errors.password 
                      ? "border-red-500 bg-red-50 focus-visible:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" 
                      : "border-transparent focus-visible:ring-primary/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end pr-6">
                <Link to="/" className="text-[10px] font-black text-primary uppercase hover:opacity-70 transition-all">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-6 italic">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col items-center pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-64 h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "INGRESAR"}
              </Button>
            </div>
          </form>

          <div className="text-center pt-6 border-t border-slate-50">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-black hover:underline ml-1">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}