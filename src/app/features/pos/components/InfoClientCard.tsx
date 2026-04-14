import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Truck,
  Store,
  Search,
  X,
  UserCheck,
  Loader2,
} from "lucide-react";
// IMPORTANTE: Asegúrate de ajustar esta ruta al store de usuarios correcto
import { useLazyGetUsersSimpleQuery } from "@/app/features/users/store/usersApi";

interface InfoClientCardProps {
  idCliente: string | null;
  onClienteSelect: (id: string, nombre: string) => void;
  onClienteClear: () => void;
  nombre: string;
  onNombreChange: (val: string) => void;
  metodoEntrega: string;
  onMetodoChange: (val: string) => void;
  referencia: string;
  onReferenciaChange: (val: string) => void;
}

export function InfoClientCard({
  idCliente,
  onClienteSelect,
  onClienteClear,
  nombre,
  onNombreChange,
  metodoEntrega,
  onMetodoChange,
  referencia,
  onReferenciaChange,
}: InfoClientCardProps) {
  const [triggerUserSearch, { data: searchResults, isFetching }] =
    useLazyGetUsersSimpleQuery();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce simple para no saturar el backend al teclear
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isSearchMode && searchTerm.length >= 2) {
        triggerUserSearch({ search: searchTerm });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isSearchMode, triggerUserSearch]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <User className="w-4 h-4" />
          Datos del Cliente y Entrega
        </h3>

        {/* Toggle Modo Invitado vs Registrado */}
        {!idCliente && (
          <button
            onClick={() => {
              setIsSearchMode(!isSearchMode);
              setSearchTerm("");
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isSearchMode
              ? "Ingresar como Invitado"
              : "Buscar Cliente Registrado"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* =========================================
            ZONA DE NOMBRE / SELECCIÓN DE CLIENTE
            ========================================= */}
        <div className="space-y-1 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">
            {idCliente
              ? "Cliente Vinculado (Fidelidad)"
              : "Nombre / Razón Social"}
          </label>

          {idCliente ? (
            // ESTADO 1: Cliente Seleccionado Exitosamente
            <div className="flex items-center justify-between w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">
                  {nombre}
                </span>
              </div>
              <button
                onClick={() => {
                  onClienteClear();
                  setIsSearchMode(false);
                }}
                className="text-blue-400 hover:text-blue-600 p-1 rounded-md transition-colors"
                title="Desvincular cliente"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : isSearchMode ? (
            // ESTADO 2: Buscador Activo
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
                placeholder="Buscar por nombre, email..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />

              {/* Resultados Flotantes */}
              {searchTerm.length >= 2 && searchResults?.data && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.data.length === 0 ? (
                    <div className="p-3 text-sm text-slate-500 text-center">
                      No se encontraron clientes
                    </div>
                  ) : (
                    searchResults.data.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onClienteSelect(user.id, user.nombre_completo);
                          setIsSearchMode(false);
                          setSearchTerm("");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
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
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            // ESTADO 3: Input Manual Normal (Invitado)
            <input
              type="text"
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
              placeholder="Ej: Juan Pérez (Invitado)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          )}
        </div>

        {/* =========================================
            ZONA DE LOGÍSTICA (MÉTODO Y DIRECCIÓN)
            ========================================= */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Método de Entrega
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {metodoEntrega === "pickup" ? (
                <Store className="w-4 h-4 text-slate-400" />
              ) : (
                <Truck className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <select
              value={metodoEntrega}
              onChange={(e) => onMetodoChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="pickup">Recojo en Tienda</option>
              <option value="delivery">Delivery / Envío</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Referencia de Dirección
          </label>
          <input
            type="text"
            value={referencia}
            onChange={(e) => onReferenciaChange(e.target.value)}
            placeholder="Ej: Zona Sur, Calle 3, Puerta Negra..."
            disabled={metodoEntrega === "pickup"}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
