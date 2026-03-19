import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Type } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { tonoSchema } from '../schemas'
import { type TonoFormValues } from "../types" 
import { useCreateTonoMutation } from "../store/tonosApi"
import { parseBackendErrors } from "@/utils/formatErrors"

export function TonoCreateModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [createTono, { isLoading }] = useCreateTonoMutation()

  const form = useForm<TonoFormValues>({
    resolver: zodResolver(tonoSchema),
    defaultValues: { nombre: "" },
  })

  useEffect(() => { if (isOpen) form.reset() }, [isOpen, form])

  const onSubmit: SubmitHandler<TonoFormValues> = async (values) => {
    try {
      await createTono(values).unwrap()
      toast.success("¡Tono registrado con éxito!")
      onClose()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errs = error?.data?.errors;
      if (errs && typeof errs === 'object') {
        parseBackendErrors(errs).forEach(msg => toast.error(msg));
      } else {
        toast.error("Error al crear el tono.");
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl border-none shadow-2xl p-0">
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter text-primary">Nuevo Tono</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase">Agrega un filtro al catálogo.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Type className="w-3 h-3" /> Nombre del Tono
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Celestes, Mieles..." className="h-11 rounded-2xl border-slate-200" />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px]">Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl font-bold uppercase text-[10px] bg-primary text-white">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}