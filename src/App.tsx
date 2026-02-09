import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (isDarkMode) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 transition-colors duration-500 bg-background text-foreground">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Afrodita UI
        </h1>
        <p className="text-muted-foreground text-lg">
          Probando la paleta {isDarkMode ? "Nocturna 🌙" : "Diurna ☀️"}
        </p>
      </div>

      <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-lg w-80 space-y-4">
        <h3 className="font-semibold text-lg">Panel de Control</h3>
        <p className="text-sm text-muted-foreground">
          Este es un ejemplo de cómo se ven los textos secundarios y los bordes en este modo.
        </p>
        
        {/* CORRECCIÓN AQUÍ: Cambiamos 'w-full' por 'flex-1' */}
        <div className="flex gap-2">
          <Button className="flex-1">Aceptar</Button>
          <Button variant="secondary" className="flex-1">Cancelar</Button>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-12 h-12 border-2"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </Button>

    </div>
  )
}

export default App