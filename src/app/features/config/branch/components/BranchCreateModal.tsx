/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Navigation, Map as MapIcon } from "lucide-react"
import { toast } from "sonner"
import { branchSchema } from "../schemas"
import { useCreateBranchMutation } from "../store/branchesApi"
import { parseBackendErrors } from "@/utils/formatErrors"

// Fix para los iconos de Leaflet en entornos de empaquetado (Vite/Webpack)
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

type FormValues = z.infer<typeof branchSchema>;

interface BranchCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BranchCreateModal({ isOpen, onClose }: BranchCreateModalProps) {
  const [createBranch, { isLoading }] = useCreateBranchMutation()
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null)

  const form = useForm<FormValues>({
    // El 'as any' evita conflictos de tipado profundo entre Zod y RHF
    resolver: zodResolver(branchSchema) as any,
    defaultValues: {
      nombre: "",
      direccion_fisica: "",
      latitud: "",
      longitud: "",
    },
  })

  // Componente interno para capturar el click en el mapa
  function MapEvents() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
        // Seteamos con precisión de 15 decimales para el DecimalField de Django
        form.setValue("latitud", lat.toFixed(15), { shouldValidate: true });
        form.setValue("longitud", lng.toFixed(15), { shouldValidate: true });
      },
    });
    return markerPos ? <Marker position={markerPos} /> : null;
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await createBranch(values).unwrap()
      toast.success("¡Sucursal registrada con éxito!")
      form.reset()
      setMarkerPos(null)
      onClose()
    } catch (error: any) {
      const backendErrors = error?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Error en el registro:", {
          description: (
            <ul className="list-disc pl-4 mt-1 space-y-1">
              {errorMessages.map((msg: string, index: number) => (
                <li key={index} className="text-xs font-bold text-slate-700 leading-snug">{msg}</li>
              ))}
            </ul>
          ),
        });
      } else {
        toast.error(error?.data?.message || "Error al procesar la solicitud.");
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] w-[95vw] max-h-[90vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 flex-shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Plus className="text-emerald-600 w-5 h-5" />
            </div>
          <div>
          <DialogTitle className="text-2xl font-black text-emerald-900 uppercase tracking-tighter leading-none">
                Nueva Sucursal
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">
                Puntos de logística y despacho Afrodita
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
            
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden h-[500px] md:h-[450px]">
              
              {/* FORMULARIO - LADO IZQUIERDO */}
              <div className="w-full md:w-5/13 p-4 space-y-4 overflow-y-auto custom-scrollbar border-r border-slate-50">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Nombre Identificador
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: Sucursal Centro..." className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm" maxLength={100} />
                      </FormControl>
                      <FormMessage className="text-[9px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direccion_fisica"
                  render={({ field }) => (
                    <FormItem className="space-y-1 text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <Navigation className="w-3 h-3" /> Dirección Exacta
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Anillo, Aveniza, Calle, Zona, Referencias..." 
                          className="min-h-[80px] rounded-2xl font-medium bg-slate-50 border-slate-100 focus:bg-white resize-none text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[9px] font-bold" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="latitud"
                      render={({ field }) => (
                        <FormItem className="space-y-1 text-left">
                          <FormLabel className="text-[9px] font-black uppercase text-slate-300 ml-1">Latitud</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} readOnly className="h-9 rounded-xl font-mono text-[10px] bg-slate-100 border-none text-slate-500 cursor-not-allowed" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitud"
                      render={({ field }) => (
                        <FormItem className="space-y-1 text-left">
                          <FormLabel className="text-[9px] font-black uppercase text-slate-300 ml-1">Longitud</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} readOnly className="h-9 rounded-xl font-mono text-[10px] bg-slate-100 border-none text-slate-500 cursor-not-allowed" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100/50 mt-2">
                   <p className="text-[9px] font-bold text-blue-600 uppercase leading-tight">
                     Instrucción: Haz clic en el mapa de la derecha para fijar la ubicación exacta de la sucursal.
                   </p>
                </div>
              </div>

              {/* MAPA - LADO DERECHO */}
              <div className="w-full md:w-7/12 h-full bg-slate-100 relative">
                <MapContainer 
                  center={[-17.7833, -63.1821]} // Santa Cruz de la Sierra
                  zoom={13} 
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapEvents />
                </MapContainer>
                <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white flex items-center gap-2">
                        <MapIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-[10px] font-black uppercase text-blue-900 tracking-tight">Geo-Selector Activo</span>
                    </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3 flex-shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest text-slate-500">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] px-10 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                {isLoading ? "Registrando..." : "Guardar Sucursal"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}