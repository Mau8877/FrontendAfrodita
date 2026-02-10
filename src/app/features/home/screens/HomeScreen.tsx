import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"

export function HomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Bienvenido a Afrodita</h1>
      <Link to="/login">
        <Button>Ir al Login</Button>
      </Link>
    </div>
  )
}