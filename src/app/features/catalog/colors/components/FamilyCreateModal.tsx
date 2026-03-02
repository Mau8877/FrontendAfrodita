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
import { Plus, Tags } from "lucide-react"
import { toast } from "sonner"
import { familiaColorSchema } from "../schemas"
import { useCreateColorFamilyMutation } from "../store/colorApi"
import { parseBackendErrors } from "@/utils/formatErrors"

type FormInput = z.input<typeof familiaColorSchema>;
type FormOutput = z.infer<typeof familiaColorSchema>;

interface FamilyCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FamilyCreateModal({ isOpen, onClose }: FamilyCreateModalProps) {
  const [createFamily, { isLoading }] = useCreateColorFamilyMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(familiaColorSchema),
    defaultValues: { nombre: "" },
  })

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    try {
      await createFamily(values).unwrap()
      toast.success("¡Nueva familia de colores creada!")
      form.reset()
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { errors?: Record<string, unknown> } };
      if (err?.data?.errors) {
        const errorMessages = parseBackendErrors(err.data.errors);
        toast.error("Error al crear familia", {
          description: <ul className="list-disc pl-4">{errorMessages.map((msg, i) => <li key={i} className="text-[10px] font-bold">{msg}</li>)}</ul>
        });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] w-[95vw] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Nueva Familia</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">Agrupa tus colores (ej: Verdes, Azules, Fantasía).</DialogDescription>
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
                    <Tags className="w-3 h-3" /> Nombre de la Familia
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Tonos Tierra..." maxLength={50} className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100" />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px]">Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="bg-primary text-white rounded-xl font-black uppercase text-[10px] px-8 shadow-lg shadow-primary/20">
                {isLoading ? "Creando..." : "Guardar Familia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}