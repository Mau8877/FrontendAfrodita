/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

import { useRegisterMutation } from '../store/registerApi'
import { registerSchema, type RegisterFormValues } from '../schemas/registerSchema'
import type { ApiErrorResponse } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function RegisterScreen() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  
  const [registerUser, { isLoading }] = useRegisterMutation()

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_confirm: '',
      nombre: '',
      apellido: '',
      telefono: ''
    }
  })

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await registerUser(data).unwrap()
      if (response.success) {
        toast.success(`¡Bienvenido, ${data.username}!`, {
          description: "Tu cuenta ha sido creada exitosamente.",
        })
        navigate({ to: '/login' })
      }
    } catch (err: any) {
      triggerShake() // Activamos el movimiento en cualquier error
      const errorData = err.data as ApiErrorResponse | undefined
      
      toast.error(errorData?.message || "Revisa los errores en el formulario", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        className: "bg-red-50 border-red-200 text-red-900 font-sans",
      })

      if (errorData?.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterFormValues, { 
            type: 'manual', 
            message: messages[0] 
          })
        })
      }
    }
  }

  // Función helper para aplicar clases de error
  const getInputClasses = (fieldName: keyof RegisterFormValues) => {
    return `h-11 rounded-full border-2 bg-slate-50 px-6 text-sm transition-all ${
      errors[fieldName] 
        ? "border-red-500 bg-red-50 focus-visible:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" 
        : "border-transparent focus-visible:ring-primary/20"
    }`
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background p-4 md:p-8 font-sans custom-scrollbar overflow-x-hidden overflow-y-auto">
      
      {/* --- DISEÑO DE CÍRCULOS SUPERPUESTOS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50/50">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-primary/20" />
        <div className="absolute top-10 -right-20 w-[300px] h-[300px] rounded-full bg-secondary/10" />
        <div className="absolute top-[40%] -left-10 w-[150px] h-[150px] rounded-full bg-accent/15" />
        <div className="absolute -bottom-20 -right-10 w-[350px] h-[350px] rounded-full bg-primary/10" />
        <div className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full bg-secondary/20" />
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-chart-5/5" />
      </div>

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
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary/10 shadow-sm"
      >
        <ArrowLeft size={14} strokeWidth={3} />
        Volver Al Inicio
      </Link>

      {/* TARJETA DE REGISTRO */}
      <div className={`relative z-10 w-full max-w-[400px] bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-300 ${isShaking ? 'animate-shake' : ''}`}>
        
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tighter">
            Registro
          </h2>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
            Inicia tu experiencia Afrodita
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="space-y-3">
            {/* USERNAME */}
            <div className="space-y-1">
              <Input {...register("username")} placeholder="Nombre de usuario *" className={getInputClasses("username")} />
              {errors.username && <p className="text-[10px] font-bold text-red-500 ml-5 italic">{errors.username.message}</p>}
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Input {...register("email")} placeholder="Correo electrónico *" className={getInputClasses("email")} />
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-5 italic">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <div className="relative">
                <Input 
                  {...register("password")} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Contraseña *" 
                  className={getInputClasses("password")} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-5 italic">{errors.password.message}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1">
              <Input 
                {...register("password_confirm")} 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirmar contraseña *" 
                className={getInputClasses("password_confirm")} 
              />
              {errors.password_confirm && <p className="text-[10px] font-bold text-red-500 ml-5 italic">{errors.password_confirm.message}</p>}
            </div>
          </div>

          {/* SECCIÓN OPCIONAL */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mx-auto"
            >
              Datos Opcionales
              {showOptional ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showOptional ? 'max-h-[280px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2.5 bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 shadow-inner">
                <Input {...register("nombre")} placeholder="Nombre" className="h-10 rounded-full border-none bg-white px-6 text-xs focus-visible:ring-primary/20" />
                <Input {...register("apellido")} placeholder="Apellido" className="h-10 rounded-full border-none bg-white px-6 text-xs focus-visible:ring-primary/20" />
                <Input {...register("telefono")} placeholder="Celular" className="h-10 rounded-full border-none bg-white px-6 text-xs focus-visible:ring-primary/20" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/30 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "REGISTRARME"}
            </Button>
          </div>
        </form>

        <div className="text-center pt-6 border-t border-slate-50 mt-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-black hover:underline ml-1">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}