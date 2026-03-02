import { useEffect } from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit3, RefreshCcw, Tags } from "lucide-react"
import { toast } from "sonner"
import { familiaColorSchema } from "../schemas"
import { useUpdateColorFamilyMutation } from "../store/colorApi"
import { type FamiliaColor } from "../types"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormInput = z.input<typeof familiaColorSchema>;
type FormOutput = z.infer<typeof familiaColorSchema>;

interface FamilyEditModalProps {
  familia: FamiliaColor | null
  isOpen: boolean
  onClose: () => void
}

export function FamilyEditModal({ familia, isOpen, onClose }: FamilyEditModalProps) {
  const [updateFamily, { isLoading }] = useUpdateColorFamilyMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(familiaColorSchema),
    defaultValues: { nombre: "" },
  })

  useEffect(() => {
    if (familia) form.reset({ nombre: familia.nombre })
  }, [familia, form])

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    if (!familia) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateFamily({ id: familia.id, body: values as any }).unwrap()
      toast.success("Familia actualizada correctamente")
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { errors?: Record<string, unknown> } };
      if (err?.data?.errors) {
        const errorMessages = parseBackendErrors(err.data.errors);
        toast.error("Error al actualizar", {
          description: <ul className="list-disc pl-4">{errorMessages.map((msg, i) => <li key={i} className="text-[10px] font-bold">{msg}</li>)}</ul>
        });
      }
    }
  }

  const handleRestore = async () => {
    if (!familia) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateFamily({ id: familia.id, body: { restore: true } as any }).unwrap()
      toast.success("¡Familia restaurada!")
      onClose()
    } catch {
      toast.error("Error al restaurar")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] w-[95vw] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Editar Familia</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">Renombrar el grupo {familia?.nombre}.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="space-y-1 text-left">
                  <FormLabel className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                    <Tags className="w-3 h-3" /> Nombre
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={50} className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100 focus:bg-white" />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            {familia?.deleted_at && (
              <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-4 h-4 text-emerald-500" />
                  <p className="text-[10px] font-black uppercase text-emerald-700">Registro en papelera</p>
                </div>
                <Button type="button" onClick={handleRestore} className="h-8 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase px-4">Restaurar</Button>
              </div>
            )}

            <DialogFooter className="pt-4 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px]">Descartar</Button>
              <Button type="submit" disabled={isLoading} className="bg-secondary text-white rounded-xl font-black uppercase text-[10px] px-8 shadow-lg transition-all active:scale-95">
                {isLoading ? "Sincronizando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}