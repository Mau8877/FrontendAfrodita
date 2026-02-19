import { ShieldAlert, ArrowLeft } from 'lucide-react'

export function AccessDenied() {
  return (
    // 'fixed inset-0' hace que ocupe toda la ventana del navegador
    // 'z-[9999]' asegura que tape el Sidebar y el Header
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1a0b2e] text-white p-6 z-[9999]">
      <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 flex flex-col items-center text-center max-w-md shadow-2xl">
        <div className="h-20 w-20 bg-[#a855f7]/20 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-[#a855f7]" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">
          Acceso Restringido
        </h1>
        
        <p className="text-white/70 font-medium mb-8">
          Esta ruta no existe o no tienes los permisos necesarios en Afrodita.
        </p>

        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[#a855f7] hover:bg-[#a855f7]/80 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver atrás
        </button>
      </div>
    </div>
  )
}