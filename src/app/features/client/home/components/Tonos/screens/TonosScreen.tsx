/* eslint-disable @typescript-eslint/no-explicit-any */
import tonoCeleste from "@/assets/homePage/Tonos/Tono Celeste.png";
import tonoGris from "@/assets/homePage/Tonos/Tono Gris.png";
import tonoMiel from "@/assets/homePage/Tonos/Tono Miel.png";
import tonoVerde from "@/assets/homePage/Tonos/Tono Verde.png";
import { Link } from "@tanstack/react-router";

const TONOS = [
  { id: 1, name: "Celeste", img: tonoCeleste, filterValue: "Celestes" },
  { id: 2, name: "Verde", img: tonoVerde, filterValue: "Verdes" },
  { id: 3, name: "Miel", img: tonoMiel, filterValue: "Mieles" },
  { id: 4, name: "Gris", img: tonoGris, filterValue: "Grises" },
];

export function TonosScreen() {
  return (
    <section className="pt-2 pb-5 w-full flex flex-col items-center px-4 md:px-12">
      {/* Encabezado */}
      <div className="text-center mb-10 md:mb-16 space-y-2">
        <h2 className="text-2xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter">
          Nuestros Tonos
        </h2>
        <div className="h-1.5 w-16 md:w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] pt-2 md:pt-4">
          Explora la variedad cromática de Afrodita
        </p>
      </div>

      {/* Grid de Tonos */}
      <div className="w-full max-w-5xl grid grid-cols-4 gap-3 md:gap-12 lg:gap-16">
        {TONOS.map((tono) => (
          <Link
            key={tono.id}
            to="/catalog"
            search={
              {
                tonos: tono.filterValue,
              } as any
            }
            className="group flex flex-col items-center transition-all active:scale-95"
          >
            <div className="relative w-full aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-lg md:shadow-2xl border border-slate-100 group-hover:shadow-secondary/40 transition-all duration-700">
              <img
                src={tono.img}
                alt={`Tono ${tono.name}`}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Textos */}
            <div className="mt-3 md:mt-6 flex flex-col items-center">
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400">
                Tono
              </span>
              <span className="text-[10px] md:text-2xl font-black uppercase tracking-tighter text-slate-800 group-hover:text-secondary transition-colors duration-300">
                {tono.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
