import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'

// --- IMPORTS DE NUESTRA ARQUITECTURA ---
import { useLoginMutation } from '../store/loginApi'
import { loginSchema, type LoginFormValues, type ApiErrorResponse } from '../types'

// --- IMPORTS DE UI (SHADCN) ---
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api } from '@/app/store'
import { setCredentials } from '@/app/store/authSlice'

export function LoginScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  
  // Hook de API
  const [login, { isLoading }] = useLoginMutation()

  // Hook de Formulario
  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap()
      
      // Limpiamos cache y guardamos credenciales
      dispatch(api.util.resetApiState());
      dispatch(setCredentials(response.data));

      if (response.success) {
        toast.success(response.message || "¡Bienvenido de nuevo!")

        // Extraemos el rol del usuario que acaba de loguearse
        const userRole = response.data.user.rol;

        // Definimos los roles administrativos autorizados
        const rolesAdmin = ['Super User', 'Admin', 'Vendedor'];

        // Lógica de redirección basada en el rol
        if (rolesAdmin.includes(userRole)) {
          navigate({ to: '/admin/dashboard' })
        } else {
          // Si es Cliente o cualquier otro rol no administrativo
          navigate({ to: '/' })
        }
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error en login:", err)
      const errorData = err.data as ApiErrorResponse | undefined

      if (errorData) {
        toast.error(errorData.message || "Error al iniciar sesión")

        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            setError(field as keyof LoginFormValues, {
              type: 'manual',
              message: messages[0]
            })
          })
        }
      } else {
        toast.error("No se pudo conectar con el servidor. Verifica tu conexión.")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Inicia Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                placeholder="usuario@ejemplo.com" 
                type="email"
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                {...register("email")} 
              />
              {errors.email && (
                <p className="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  {...register("password")} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {errors.password && (
                <p className="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BOTÓN */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Ingresar
                </>
              )}
            </Button>

          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link 
              to="/register" 
              className="text-primary hover:underline font-medium"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}