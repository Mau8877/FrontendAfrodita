import { useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit3, Type, Palette, RefreshCcw, FolderTree } from "lucide-react"
import { toast } from "sonner"
import { colorSchema } from "../schemas"
import { useUpdateColorMutation, useGetColorSelectorsQuery } from "../store/colorApi"
import { type Color } from "../types"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormInput = z.input<typeof colorSchema>;
type FormOutput = z.infer<typeof colorSchema>;

interface ColorEditModalProps {
  color: Color | null
  isOpen: boolean
  onClose: () => void
}

export function ColorEditModal({ color, isOpen, onClose }: ColorEditModalProps) {
  const [updateColor, { isLoading }] = useUpdateColorMutation()
  // Cargamos las familias disponibles para el selector
  const { data: selectors } = useGetColorSelectorsQuery()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      nombre: "",
      codigo_hex: "",
      id_familia: null,
    },
  })

  useEffect(() => {
    if (color) {
      form.reset({
        nombre: color.nombre,
        codigo_hex: color.codigo_hex || "",
        id_familia: color.id_familia || null, // Cargamos la familia actual del color
      })
    }
  }, [color, form])

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    if (!color) return
    try {
      const payload = { ...values };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateColor({ id: color.id, body: payload as any }).unwrap()
      toast.success("¡Color actualizado con éxito!")
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string, errors?: Record<string, unknown> } };
      const backendErrors = err?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Error al actualizar:", {
          description: (
            <ul className="list-disc pl-4 mt-2 space-y-1.5">
              {errorMessages.map((msg, index) => (
                <li key={index} className="text-xs font-bold text-slate-700 leading-snug">{msg}</li>
              ))}
            </ul>
          ),
          duration: 6000,
        });
      } else {
        toast.error(err?.data?.message || "Error al procesar la solicitud.");
      }
    }
  }

  const handleRestore = async () => {
    if (!color) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateColor({ id: color.id, body: { restore: true } as any }).unwrap()
      toast.success("¡Color restaurado de la papelera!")
      onClose()
    } catch {
      toast.error("No se pudo restaurar el color.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] h-auto bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        <DialogHeader className="relative bg-primary/5 p-6 sm:p-6 border-b border-primary/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                Editar Color
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                Modifica los datos y la familia de {color?.nombre}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 space-y-5 text-left flex-grow overflow-y-auto custom-scrollbar">
              
              {/* CAMPO FAMILIA */}
              <FormField
                control={form.control}
                name="id_familia"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <FolderTree className="w-3 h-3" /> Familia del Color
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50 focus:ring-secondary/20 transition-all">
                          <SelectValue placeholder="Sin familia asignada" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        {selectors?.data.familias.map((familia) => (
                          <SelectItem 
                            key={familia.id} 
                            value={familia.id}
                            className="text-xs font-bold text-slate-600 focus:bg-primary/5 focus:text-primary rounded-xl m-1"
                          >
                            {familia.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              {/* CAMPO NOMBRE */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <Type className="w-3 h-3" /> Nombre del Color
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        maxLength={50}
                        className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50 focus:ring-secondary/20" 
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              {/* CAMPO HEX */}
              <FormField
                control={form.control}
                name="codigo_hex"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <Palette className="w-3 h-3" /> Código HEX
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <span className="absolute left-12 text-slate-400 font-bold select-none">
                          #
                        </span>
                        
                        <Input 
                          {...field} 
                          value={field.value?.replace('#', '') ?? ""}
                          placeholder="000000" 
                          maxLength={6} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^A-Fa-f0-9]/g, ''); 
                            field.onChange(`#${val}`); 
                          }}
                          className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all pl-16" 
                        />

                        <div 
                          className="absolute left-3 w-6 h-6 rounded-lg border border-white shadow-sm transition-colors duration-300"
                          style={{ backgroundColor: field.value?.startsWith('#') ? field.value : '#e2e8f0' }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              {color?.deleted_at && (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <RefreshCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-emerald-700">Color en Papelera</p>
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase leading-none">Puedes restaurarlo al catálogo</p>
                    </div>
                  </div>
                  <Button type="button" onClick={handleRestore} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[9px] px-4">
                    Restaurar
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3 flex-shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="h-9 rounded-xl font-bold uppercase text-[9px] tracking-widest">Descartar</Button>
              <Button type="submit" disabled={isLoading} className="h-9 bg-secondary text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg px-8 active:scale-95 transition-all">
                {isLoading ? "Sincronizando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}