export const LoaderAfrodita = ({ 
  message = "Verificando Seguridad",
  hasError = false 
}: { 
  message?: string;
  hasError?: boolean;
}) => {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-500"
      role={hasError ? "alert" : "status"} 
      aria-live="assertive"
    >
      <style>{`
        /* El parpadeo ahora SOLO afecta al globo ocular, no al delineado */
        @keyframes blink-eyeball {
          0%, 90%, 100% { transform: scaleY(1); opacity: 1; }
          95% { transform: scaleY(0); opacity: 0; }
        }
        @keyframes iris-drift {
          0%, 100% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
        }
        @keyframes bar-slide {
          0%   { left: -50%; }
          100% { left: 100%; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(1.1); }
        }
      `}</style>

      <div className="relative flex flex-col items-center gap-8 w-full max-w-sm">
        
        {/* Glow de fondo: Cambia a rojo sutil si hay error */}
        <div className={`absolute rounded-full blur-[60px] animate-[glow-pulse_4s_ease-in-out_infinite] w-64 h-64 top-[-50px] pointer-events-none transition-colors duration-700 ${hasError ? 'bg-red-500/20' : 'bg-primary/30'}`}></div>

        {/* ── CONTENEDOR PRINCIPAL (ESTÁTICO, NO SE APLASTA) ── */}
        <div className="relative flex justify-center items-center w-48 h-24">
          
          {/* Globo ocular (Esclerótica + Iris) */}
          {/* Si hay error: Altura 0. Si no: Parpadea normalmente */}
          <div 
            className={`relative w-40 bg-white rounded-[100%/100%] shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] border border-secondary/20 flex items-center justify-center overflow-hidden z-10 transition-all duration-700 ease-in-out origin-center
            ${hasError ? 'h-0 opacity-0 scale-y-0' : 'h-20 opacity-100 scale-y-100 animate-[blink-eyeball_4s_infinite_ease-in-out]'}`}
          >
            <div className="absolute top-0 w-full h-5 bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none z-20"></div>

            <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-secondary via-primary to-secondary shadow-md flex items-center justify-center animate-[iris-drift_6s_infinite_ease-in-out]">
              <div className="h-6 w-6 bg-slate-900 rounded-full shadow-inner"></div>
              <div className="absolute top-2.5 right-2.5 h-3 w-3 bg-white/70 rounded-full blur-[0.5px]"></div>
              <div className="absolute bottom-3 left-3 h-1.5 w-1.5 bg-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Delineado Fijo (La Media Luna). Se queda visible siempre */}
          {/* Si hay error, se pinta de rojo para dar la vibra de sistema caído */}
          <div className={`absolute w-44 h-24 border-t-[3.5px] rounded-[100%] top-[-1px] pointer-events-none z-20 transition-colors duration-700 ${hasError ? 'border-red-500/60' : 'border-secondary/40'}`}></div>
          
          {/* Pequeña línea inferior que aparece en el error para reforzar que el ojo está cerrado herméticamente */}
          {hasError && (
            <div className="absolute w-32 h-[2px] bg-red-500/20 rounded-full top-[46px] animate-in fade-in duration-700"></div>
          )}
        </div>

        {/* ── TEXTO, BARRA Y ESTADO ── */}
        <div className="flex flex-col items-center gap-4 mt-4 w-full z-10">
          <p className={`m-0 text-[11px] font-black tracking-[0.4em] uppercase text-center transition-colors duration-500 ${hasError ? 'text-red-500' : 'text-secondary/70 animate-pulse'}`}>
            {message}
          </p>

          <span className="sr-only">{hasError ? 'Error.' : 'Cargando.'} {message}</span>

          <div className="h-[2px] w-32 bg-secondary/10 rounded-full overflow-hidden relative shadow-sm">
            <div className={`absolute top-0 h-full rounded-full transition-all duration-500 ${hasError ? 'w-full bg-red-500 left-0' : 'w-[40%] bg-gradient-to-r from-primary to-secondary animate-[bar-slide_1.5s_linear_infinite]'}`} />
          </div>
        </div>

      </div>
    </div>
  )
}