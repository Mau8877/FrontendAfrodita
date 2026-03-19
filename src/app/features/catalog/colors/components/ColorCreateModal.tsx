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
import { Button } from "@/components/ui/button"
import { Plus, Type, Palette } from "lucide-react"
import { toast } from "sonner"
import { colorSchema } from "../schemas"
import { useCreateColorMutation } from "../store/colorApi"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormInput = z.input<typeof colorSchema>;
type FormOutput = z.infer<typeof colorSchema>;

interface ColorCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ColorCreateModal({ isOpen, onClose }: ColorCreateModalProps) {
  const [createColor, { isLoading }] = useCreateColorMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      nombre: "",
      codigo_hex: "",
    },
  })

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    try {
      await createColor(values).unwrap()
      toast.success("¡Color registrado con éxito!")
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
        
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 flex-shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Plus className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-emerald-900 uppercase tracking-tighter leading-none">
                Nuevo Color
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">
                Añade una variante de color a tu catálogo.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
            
            <div className="p-6 space-y-5 flex-grow overflow-y-auto custom-scrollbar">
              
              {/* CAMPO NOMBRE */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <Type className="w-3 h-3" /> Nombre del Color
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: Verde Esmeralda, Azul Zafiro..." 
                        maxLength={50}
                        className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all" 
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
                          maxLength={7} 
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
            </div>

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
                {isLoading ? "Registrando..." : "Guardar Color"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}