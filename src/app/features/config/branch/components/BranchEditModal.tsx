/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
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
import { Edit3, MapPin, Navigation, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { branchSchema } from "../schemas"
import { useUpdateBranchMutation } from "../store/branchesApi"
import { type Branch } from "../types"
import { parseBackendErrors } from "@/utils/formatErrors"

// Fix para iconos de Leaflet
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

interface BranchEditModalProps {
  branch: Branch | null
  isOpen: boolean
  onClose: () => void
}

export function BranchEditModal({ branch, isOpen, onClose }: BranchEditModalProps) {
  const [updateBranch, { isLoading }] = useUpdateBranchMutation()
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(branchSchema) as any,
    defaultValues: {
      nombre: "",
      direccion_fisica: "",
      latitud: "",
      longitud: "",
    },
  })

  // Cargar datos y posicionar marcador inicial
  useEffect(() => {
    if (branch && isOpen) {
      form.reset({
        nombre: branch.nombre,
        direccion_fisica: branch.direccion_fisica,
        latitud: branch.latitud || "",
        longitud: branch.longitud || "",
      })
      if (branch.latitud && branch.longitud) {
        setMarkerPos([Number(branch.latitud), Number(branch.longitud)])
      }
    }
  }, [branch, isOpen, form])

  // Componente para centrar el mapa y capturar clicks
  function MapController() {
    const map = useMap()
    
    // Centrar mapa cuando carga la sucursal
    useEffect(() => {
      if (markerPos) {
        map.flyTo(markerPos, 15)
      }
    }, [map])

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
        form.setValue("latitud", lat.toFixed(15), { shouldValidate: true });
        form.setValue("longitud", lng.toFixed(15), { shouldValidate: true });
      },
    });

    return markerPos ? <Marker position={markerPos} /> : null;
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!branch) return
    try {
      await updateBranch({ id: branch.id, body: values }).unwrap()
      toast.success("¡Sucursal actualizada!")
      onClose()
    } catch (error: any) {
      const backendErrors = error?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Error al actualizar:", {
          description: (
            <ul className="list-disc pl-4 mt-1 space-y-1">
              {errorMessages.map((msg: string, index: number) => (
                <li key={index} className="text-xs font-bold text-slate-700">{msg}</li>
              ))}
            </ul>
          ),
        });
      } else {
        toast.error(error?.data?.message || "Error al procesar la solicitud.");
      }
    }
  }

  const handleRestore = async () => {
    if (!branch) return
    try {
      await updateBranch({ id: branch.id, body: { restore: true } as any }).unwrap()
      toast.success("¡Sucursal restaurada!")
      onClose()
    } catch {
      toast.error("No se pudo restaurar la sucursal.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] w-[95vw] max-h-[90vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10 flex-shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                Editar Sucursal
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                Actualizando datos de {branch?.nombre}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
            
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden h-[500px] md:h-[450px]">
              
              <div className="w-full md:w-5/13 p-4 space-y-4 overflow-y-auto custom-scrollbar border-r border-slate-50">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Nombre
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm" maxLength={100}/>
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direccion_fisica"
                  render={({ field }) => (
                    <FormItem className="space-y-1 text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <Navigation className="w-3 h-3" /> Dirección
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[80px] rounded-2xl font-medium bg-slate-50 border-slate-100 focus:bg-white resize-none text-xs" />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="latitud" render={({ field }) => (
                        <FormItem className="space-y-1 text-left">
                          <FormLabel className="text-[9px] font-black uppercase text-slate-300 ml-1">Latitud</FormLabel>
                          <FormControl><Input {...field} value={field.value ?? ""} readOnly className="h-9 rounded-xl font-mono text-[10px] bg-slate-100 border-none text-slate-500 cursor-not-allowed" /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="longitud" render={({ field }) => (
                        <FormItem className="space-y-1 text-left">
                          <FormLabel className="text-[9px] font-black uppercase text-slate-300 ml-1">Longitud</FormLabel>
                          <FormControl><Input {...field} value={field.value ?? ""} readOnly className="h-9 rounded-xl font-mono text-[10px] bg-slate-100 border-none text-slate-500 cursor-not-allowed" /></FormControl>
                        </FormItem>
                    )} />
                </div>
                {branch?.deleted_at && (
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 mt-4">
                    <div className="flex items-center gap-2 text-left">
                      <RefreshCcw className="w-4 h-4 text-emerald-600" />
                      <p className="text-[9px] font-black uppercase text-emerald-700">Sucursal en papelera</p>
                    </div>
                    <Button type="button" onClick={handleRestore} className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black uppercase text-[8px] px-3">Restaurar</Button>
                  </div>
                )}
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100/50 mt-2">
                   <p className="text-[9px] font-bold text-blue-600 uppercase leading-tight">
                     Instrucción: Haz clic en el mapa de la derecha para fijar la ubicación exacta de la sucursal.
                   </p>
                </div>
              </div>

              <div className="w-full md:w-7/12 h-full bg-slate-100 relative">
                <MapContainer center={[-17.7833, -63.1821]} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  <MapController />
                </MapContainer>
              </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="h-9 rounded-xl font-bold uppercase text-[9px] tracking-widest">Descartar</Button>
              <Button type="submit" disabled={isLoading} className="h-9 bg-secondary text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg px-8">
                {isLoading ? "Sincronizando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}