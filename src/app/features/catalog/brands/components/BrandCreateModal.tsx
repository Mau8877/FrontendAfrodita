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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Type, FileText } from "lucide-react"
import { toast } from "sonner"
import { brandSchema } from "../schemas"
import { useCreateBrandMutation } from "../store/brandApi"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormInput = z.input<typeof brandSchema>;
type FormOutput = z.infer<typeof brandSchema>;

interface BrandCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BrandCreateModal({ isOpen, onClose }: BrandCreateModalProps) {
  const [createBrand, { isLoading }] = useCreateBrandMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  })

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    try {
      await createBrand(values).unwrap()
      toast.success("¡Marca registrada con éxito!")
      form.reset()
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string, errors?: Record<string, unknown> } };
      const backendErrors = err?.data?.errors;
      
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
          duration: 6000,
        });
      } else {
        toast.error(err?.data?.message || "Error al procesar la solicitud.");
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 flex-shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Plus className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-emerald-900 uppercase tracking-tighter leading-none">
                Nueva Marca
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">
                Añade fabricantes o proveedores de lentes al catálogo.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
            
            {/* CUERPO DEL FORMULARIO CON PADDING */}
            <div className="p-6 space-y-4 flex-grow overflow-y-auto custom-scrollbar">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <Type className="w-3 h-3" /> Nombre de la Marca
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: Urban Layer, Freshlady..." 
                        maxLength={100}
                        onChange={(e) => field.onChange(e.target.value.substring(0, 100))}
                        className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all" 
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Descripción Opcional
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value ?? ""}
                        placeholder="Detalles o descripción de la marca..." 
                        maxLength={500}
                        onChange={(e) => field.onChange(e.target.value.substring(0, 500))}
                        className="min-h-[120px] rounded-2xl font-medium bg-slate-50 border-slate-100 focus:bg-white resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* FOOTER GRIS QUE "CHOCA" CON LAS PAREDES */}
            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3 flex-shrink-0">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="h-10 rounded-xl font-bold uppercase text-[10px]"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] px-10 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                {isLoading ? "Registrando..." : "Guardar Marca"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}