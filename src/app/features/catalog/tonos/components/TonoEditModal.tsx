import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Edit3, Type, RefreshCcw } from "lucide-react"
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
import { type TonoFormValues, type Tono } from "../types" 
import { useUpdateTonoMutation } from "../store/tonosApi"
import { parseBackendErrors } from "@/utils/formatErrors"

export function TonoEditModal({ tono, isOpen, onClose }: { tono: Tono | null, isOpen: boolean, onClose: () => void }) {
  const [updateTono, { isLoading }] = useUpdateTonoMutation()

  const form = useForm<TonoFormValues>({
    resolver: zodResolver(tonoSchema),
    defaultValues: { nombre: "" },
  })

  useEffect(() => { if (tono && isOpen) form.reset({ nombre: tono.nombre }) }, [tono, isOpen, form])

  const onSubmit: SubmitHandler<TonoFormValues> = async (values) => {
    if (!tono) return
    try {
      await updateTono({ id: tono.id, body: values }).unwrap()
      toast.success("¡Tono actualizado!")
      onClose()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errs = error?.data?.errors;
      if (errs && typeof errs === 'object') {
        parseBackendErrors(errs).forEach(msg => toast.error(msg));
      } else {
        toast.error("Error al actualizar.");
      }
    }
  }

  const handleRestore = async () => {
    if (!tono) return
    try {
      await updateTono({ id: tono.id, body: { restore: true } }).unwrap()
      toast.success("¡Tono restaurado!")
      onClose()
    } catch {
      toast.error("No se pudo restaurar.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl border-none shadow-2xl p-0">
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter text-primary">Editar Tono</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase">Modificando {tono?.nombre}</DialogDescription>
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
                    <Type className="w-3 h-3" /> Nombre
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11 rounded-2xl border-slate-200" />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            {tono?.deleted_at && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-left">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-[11px] font-black text-emerald-700 uppercase">En Papelera</p>
                  </div>
                </div>
                <Button type="button" onClick={handleRestore} className="h-8 bg-emerald-600 text-white rounded-lg text-[9px] font-bold">Restaurar</Button>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px]">Descartar</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl font-bold uppercase text-[10px] bg-secondary text-white">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}