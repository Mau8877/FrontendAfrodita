import { Button } from "@/components/ui/button"

export function HomeHero() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <h1 className="text-4xl font-bold text-primary">Bienvenido a Afrodita</h1>
      <p className="text-muted-foreground">Tu sistema de gestión favorito</p>
      <Button>Empezar</Button>
    </div>
  )
}