import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseBackendErrors } from "@/utils/formatErrors";
import { pedidoEditSchema } from "../schemas";
import { useUpdatePedidoMutation } from "../store";
import type { Pedido } from "../types";

type FormInput = z.input<typeof pedidoEditSchema>;
type FormOutput = z.infer<typeof pedidoEditSchema>;

interface PedidoEditModalProps {
  pedido: Pedido | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PedidoEditModal({ pedido, isOpen, onClose }: PedidoEditModalProps) {
  const [updatePedido, { isLoading }] = useUpdatePedidoMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(pedidoEditSchema),
    defaultValues: { estado: "PENDIENTE" },
  });

  useEffect(() => {
    if (pedido) {
      form.reset({ estado: pedido.estado });
    }
  }, [pedido, form]);

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    if (!pedido) return;
    try {
      await updatePedido({ id: pedido.id, body: values }).unwrap();
      toast.success("Pedido actualizado con éxito.");
      onClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string; errors?: Record<string, unknown> } };
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
        });
      } else {
        toast.error(err?.data?.message || "Error al procesar la solicitud.");
      }
    }
  };

  const handleRestore = async () => {
    if (!pedido) return;
    try {
      await updatePedido({ id: pedido.id, body: { restore: true } }).unwrap();
      toast.success("Pedido restaurado de la papelera.");
      onClose();
    } catch {
      toast.error("No se pudo restaurar el pedido.");
    }
  };

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
                Editar Pedido
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                Código: {pedido?.codigo}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 space-y-5 text-left">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="space-y-2 max-w-[320px] mx-auto w-full">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 text-center block">Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-xl border-blue-500/10 font-bold text-secondary bg-slate-50/50">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="PENDIENTE" className="font-bold text-xs uppercase">Pendiente</SelectItem>
                        <SelectItem value="COMPLETADO" className="font-bold text-xs uppercase">Completado</SelectItem>
                        <SelectItem value="EN_CAMINO" className="font-bold text-xs uppercase">En Camino</SelectItem>
                        <SelectItem value="CANCELADO" className="font-bold text-xs uppercase">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              {pedido?.deleted_at && (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <RefreshCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-emerald-700">Pedido en Papelera</p>
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase leading-none">Puedes restaurarlo</p>
                    </div>
                  </div>
                  <Button type="button" onClick={handleRestore} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[9px] px-4">
                    Restaurar
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="h-9 rounded-xl font-bold uppercase text-[9px] tracking-widest">
                Descartar
              </Button>
              <Button type="submit" disabled={isLoading} className="h-9 bg-secondary text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg px-8">
                {isLoading ? "Sincronizando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
