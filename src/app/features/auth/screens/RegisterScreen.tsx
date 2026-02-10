import { Link } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'

// --- SHADCN UI ---
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from '@/components/ui/button' // Para que el link parezca botón

export function RegisterScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>
            Únete a nuestra plataforma
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
            <span className="text-4xl">🚧🏗️</span>
            <p className="text-lg font-medium">Página en Construcción</p>
            <p className="text-sm">
              Pronto podrás registrarte aquí. Por ahora, ¡vuelve al login para probar!
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2 pb-6">
          {/* Usamos buttonVariants para que el Link de TanStack parezca un botón de Shadcn */}
          <Link 
            to="/login" 
            className={buttonVariants({ variant: "default", className: "w-full" })}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Volver al Login
          </Link>
        </CardFooter>
        
      </Card>
    </div>
  )
}