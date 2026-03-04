/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit3, Type, Phone, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { supplierSchema } from "../schemas"
import { useUpdateSupplierMutation } from "../store/suppliersApi"
import { type Supplier } from "../types"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormInput = z.input<typeof supplierSchema>;
type FormOutput = z.infer<typeof supplierSchema>;

interface SupplierEditModalProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
}

export function SupplierEditModal({ supplier, isOpen, onClose }: SupplierEditModalProps) {
  const [updateSupplier, { isLoading }] = useUpdateSupplierMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
    },
  })

  useEffect(() => {
    if (supplier) {
      form.reset({
        nombre: supplier.nombre,
        telefono: supplier.telefono || "",
      })
    }
  }, [supplier, form])

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    if (!supplier) return
    try {
      const payload = { ...values };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateSupplier({ id: supplier.id, body: payload as any }).unwrap()
      toast.success("¡Proveedor actualizado con éxito!")
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
    if (!supplier) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateSupplier({ id: supplier.id, body: { restore: true } as any }).unwrap()
      toast.success("¡Proveedor restaurado de la papelera!")
      onClose()
    } catch {
      toast.error("No se pudo restaurar el proveedor.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] h-auto bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col text-left">
        
        <DialogHeader className="relative bg-primary/5 p-6 sm:p-6 border-b border-primary/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                Editar Proveedor
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                Modifica los datos de contacto de {supplier?.nombre}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 space-y-5 text-left">
              
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <Type className="w-3 h-3" /> Nombre o Razón Social
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        maxLength={255}
                        className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50" 
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem className="space-y-1 text-left">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value ?? ""} 
                        maxLength={20}
                        className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50" 
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              {supplier?.deleted_at && (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <RefreshCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-emerald-700">Proveedor en Papelera</p>
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