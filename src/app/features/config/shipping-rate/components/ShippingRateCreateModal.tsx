/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Ruler, DollarSign, MapPin, Globe } from "lucide-react"
import { toast } from "sonner"
import { shippingRateSchema } from "../schemas"
import { useCreateShippingRateMutation } from "../store"
import { useGetBranchesSimpleQuery } from "@/app/features/config"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormValues = z.infer<typeof shippingRateSchema>;

interface ShippingRateCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShippingRateCreateModal({ isOpen, onClose }: ShippingRateCreateModalProps) {
  const [createRate, { isLoading }] = useCreateShippingRateMutation()
  const { data: branchesResponse, isLoading: isLoadingBranches } = useGetBranchesSimpleQuery()
  const branches = branchesResponse?.data || []

  const form = useForm<FormValues>({
    resolver: zodResolver(shippingRateSchema) as any,
    defaultValues: {
      id_sucursal: "",
      distancia_min: "" as any, 
      distancia_max: "" as any,
      precio: "" as any,
      es_local: true,
    },
  })

  const esLocal = form.watch("es_local");

  const toggleLocal = (checked: boolean) => {
    form.setValue("es_local", checked);
    if (!checked) {
      form.setValue("distancia_min", 0);
      form.setValue("distancia_max", 0);
      form.setValue("precio", 0);
    } else {
      form.setValue("distancia_min", "" as any);
      form.setValue("distancia_max", "" as any);
      form.setValue("precio", "" as any);
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await createRate(values).unwrap()
      toast.success("¡Tarifa de envío registrada!")
      form.reset()
      onClose()
    } catch (error: any) {
      const backendErrors = error?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Error en el registro:", {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        {/* HEADER ESTILO AFRODITA - EMERALD */}
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Plus className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-emerald-900 uppercase tracking-tighter leading-none">
                Nueva Tarifa
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">
                Configura el costo de delivery para Afrodita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
            
            <div className="p-6 space-y-5">
              {/* SWITCH DE MODO NACIONAL / LOCAL */}
              <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${esLocal ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {esLocal ? <MapPin className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase text-slate-700 leading-tight tracking-tight">¿Es Envío Local?</span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {esLocal ? "Cálculo por KM en ciudad" : "Envío Nacional / A coordinar"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={esLocal} 
                  onCheckedChange={toggleLocal}
                />
              </div>

              <FormField
                control={form.control}
                name="id_sucursal"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Sucursal de Origen
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm">
                          <SelectValue placeholder={isLoadingBranches ? "Cargando..." : "Selecciona sucursal"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        {branches.map((b) => (
                          <SelectItem key={b.id} value={b.id} className="font-bold text-xs uppercase">
                            {b.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[9px] font-bold" />
                  </FormItem>
                )}
              />

              <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${!esLocal ? 'opacity-40 pointer-events-none' : ''}`}>
                <FormField
                  control={form.control}
                  name="distancia_min"
                  render={({ field }) => (
                    <FormItem className="space-y-1 text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <Ruler className="w-3 h-3" /> KM Mínimo
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          placeholder="0.0"
                          className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm"
                          {...field}
                          value={field.value === 0 && esLocal ? "" : field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-[9px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distancia_max"
                  render={({ field }) => (
                    <FormItem className="space-y-1 text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <Ruler className="w-3 h-3" /> KM Máximo
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          placeholder="0.0"
                          className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm"
                          {...field}
                          value={field.value === 0 && esLocal ? "" : field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-[9px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className={`transition-all duration-300 ${!esLocal ? 'opacity-40 pointer-events-none' : ''}`}>
                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem className="space-y-1 text-left">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> Precio del Envío (Bs)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00"
                          className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 text-emerald-700 focus:bg-white transition-all shadow-sm"
                          {...field}
                          value={field.value === 0 && esLocal ? "" : field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-[9px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* FOOTER ESTILO AFRODITA - IGUAL A SUCURSALES */}
            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3 flex-shrink-0">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest text-slate-500"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] px-10 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                {isLoading ? "Registrando..." : "Guardar Tarifa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}