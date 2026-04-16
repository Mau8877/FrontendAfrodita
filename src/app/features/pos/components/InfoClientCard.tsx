/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  User,
  Truck,
  Store,
  Search,
  X,
  UserCheck,
  Loader2,
  UserX,
  Map as MapIcon,
  ExternalLink,
  Info,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useLazyGetUsersSimpleQuery } from "@/app/features/users/store/usersApi";

// Importaciones de Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Arreglo nativo de Leaflet
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: (markerIcon as any).src || (markerIcon as string),
  iconRetinaUrl: (markerIcon2x as any).src || (markerIcon2x as string),
  shadowUrl: (markerShadow as any).src || (markerShadow as string),
});

interface InfoClientCardProps {
  idCliente: string | null | undefined;
  onClienteSelect: (id: string, nombre: string) => void;
  onClienteClear: () => void;
  nombre: string;
  metodoEntrega: string;
  onMetodoChange: (val: string) => void;
  referencia: string;
  onReferenciaChange: (val: string) => void;
  latitud?: number | null;
  longitud?: number | null;
  originalLat?: number | null;
  originalLng?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

// 1. Subcomponente para capturar clics en el mapa
function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// 2. Subcomponente para animar el centro del mapa
function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 0.5 });
  }, [lat, lng, map]);
  return null;
}

export function InfoClientCard({
  idCliente,
  onClienteSelect,
  onClienteClear,
  nombre,
  metodoEntrega,
  onMetodoChange,
  referencia,
  onReferenciaChange,
  latitud,
  longitud,
  originalLat,
  originalLng,
  onLocationChange,
}: InfoClientCardProps) {
  const [triggerUserSearch, { data: searchResults, isFetching }] =
    useLazyGetUsersSimpleQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Debounce para el buscador
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) {
        triggerUserSearch({ search: searchTerm });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, triggerUserSearch]);

  // Cerrar el select custom al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isClienteSeleccionado = !!idCliente || nombre === "cliente_generico";
  const esEnvio = metodoEntrega === "delivery";
  const haCambiadoUbicacion =
    latitud !== originalLat || longitud !== originalLng;

  // ==========================================
  // BLOQUE 1: Buscador y Tarjeta de Cliente
  // ==========================================
  const bloqueCliente = (
    <div className="space-y-1 relative">
      <label className="text-xs font-bold text-secondary/75 uppercase">
        {idCliente ? "Cliente Vinculado" : "Cliente Sin Cuenta"}
      </label>

      {isClienteSeleccionado ? (
        <div
          className={`flex items-center justify-between w-full border rounded-xl px-4 py-2.5 ${idCliente ? "bg-blue-50 border-blue-200" : "bg-slate-100 border-slate-200"}`}
        >
          <div className="flex items-center gap-2">
            {idCliente ? (
              <UserCheck className="w-4 h-4 text-blue-600" />
            ) : (
              <UserX className="w-4 h-4 text-slate-500" />
            )}
            <span
              className={`text-sm font-bold ${idCliente ? "text-blue-900" : "text-slate-600"} truncate max-w-[180px]`}
            >
              {nombre === "cliente_generico" ? "Cliente Genérico" : nombre}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClienteClear();
              setSearchTerm("");
            }}
            className={`${idCliente ? "text-blue-400 hover:text-blue-600" : "text-slate-400 hover:text-slate-600"} p-1 rounded-md transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isFetching ? (
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar registrado..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchTerm.length >= 2 && searchResults?.data && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {searchResults.data.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onClienteSelect(user.id, user.nombre_completo);
                    setSearchTerm("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  <div className="text-sm font-bold text-slate-900">
                    {user.nombre_completo}
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>{user.email}</span>
                    <span className="text-amber-600 font-medium">
                      {user.puntos_fidelidad} pts
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ==========================================
  // BLOQUE 2: Dropdown Custom de Método de Entrega
  // ==========================================
  const bloqueMetodo = (
    <div className="space-y-1">
      <label className="text-xs font-bold text-secondary/75 uppercase">
        Método de Entrega
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          className={`w-full bg-slate-50 border rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${isSelectOpen ? "border-primary bg-white" : "border-slate-200"}`}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {esEnvio ? (
              <Truck className="w-4 h-4 text-slate-400" />
            ) : (
              <Store className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <span>{esEnvio ? "Delivery / Envío" : "Recojo en Tienda"}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSelectOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isSelectOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => {
                onMetodoChange("pickup");
                setIsSelectOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 ${!esEnvio ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/10 hover:text-primary"}`}
            >
              <Store
                className={`w-4 h-4 ${!esEnvio ? "text-white" : "text-slate-400"}`}
              />
              Recojo en Tienda
            </button>

            <button
              type="button"
              onClick={() => {
                onMetodoChange("delivery");
                setIsSelectOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 ${esEnvio ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/10 hover:text-primary"}`}
            >
              <Truck
                className={`w-4 h-4 ${esEnvio ? "text-white" : "text-slate-400"}`}
              />
              Delivery / Envío
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // RENDER PRINCIPAL DEL COMPONENTE
  // ==========================================
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-secondary uppercase tracking-widest flex items-center gap-2">
          <User className="w-4 h-4" />
          Datos del Cliente y Entrega
        </h3>
      </div>

      {esEnvio ? (
        /* --- LAYOUT ENVÍO: Formulario a la Izquierda, Mapa a la Derecha --- */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {bloqueCliente}
            {bloqueMetodo}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary/75 uppercase flex items-center gap-1">
                Referencia de Dirección
              </label>
              <textarea
                value={referencia}
                onChange={(e) => onReferenciaChange(e.target.value)}
                placeholder="Ej: Zona Sur, Calle 3, Puerta Negra..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* MAPA INTERACTIVO */}
          <div className="h-[300px] lg:h-full lg:min-h-[300px] relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 z-0">
            {latitud && longitud ? (
              <>
                <MapContainer
                  center={[latitud, longitud]}
                  zoom={15}
                  scrollWheelZoom={true}
                  className="w-full h-full absolute inset-0 z-0 cursor-crosshair"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Pin interactivo bloqueado para drag, se mueve por el MapClickHandler */}
                  <Marker position={[latitud, longitud]} interactive={false} />

                  {/* Componentes invisibles que le dan superpoderes al mapa */}
                  <MapClickHandler onLocationChange={onLocationChange} />
                  <MapCenterUpdater lat={latitud} lng={longitud} />
                </MapContainer>

                {/* INFO SUPERIOR (Más pequeña y a la derecha, lejos de los botones de zoom) */}
                <div className="absolute top-2 right-2 z-[400] bg-white/95 backdrop-blur-sm text-blue-700 px-2 py-1.5 rounded-md text-[10px] font-bold shadow-sm border border-slate-200 flex items-center gap-1.5 pointer-events-none">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  Pulsa en el mapa para mover
                </div>

                {/* CONTROLES INFERIORES */}
                <div className="absolute bottom-3 right-3 z-[400] flex items-center gap-2">
                  {haCambiadoUbicacion && originalLat && originalLng && (
                    <button
                      type="button"
                      onClick={() => onLocationChange(originalLat, originalLng)}
                      className="bg-white text-slate-700 px-3 py-2 rounded-lg font-bold text-xs shadow-md border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${latitud},${longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-3 py-2 rounded-lg font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir en Maps
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                <MapIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">
                  Ubicación no proporcionada
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- LAYOUT RECOJO: Cliente y Método uno al lado del otro --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bloqueCliente}
          {bloqueMetodo}
        </div>
      )}
    </div>
  );
}
