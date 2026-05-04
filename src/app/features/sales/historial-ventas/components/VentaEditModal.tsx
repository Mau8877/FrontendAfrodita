import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseBackendErrors } from "@/utils/formatErrors";
import { ventaEditSchema } from "../schemas";
import { useUpdateVentaMutation } from "../store";
import type { Venta } from "../types";

type FormInput = z.input<typeof ventaEditSchema>;
type FormOutput = z.infer<typeof ventaEditSchema>;

interface VentaEditModalProps {
  venta: Venta | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VentaEditModal({ venta, isOpen, onClose }: VentaEditModalProps) {
  const [updateVenta, { isLoading }] = useUpdateVentaMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(ventaEditSchema),
    defaultValues: { estado: "PENDIENTE", observaciones: "" },
  });

  useEffect(() => {
    if (venta) {
      form.reset({
        estado: venta.estado,
        observaciones: venta.observaciones || "",
      });
    }
  }, [venta, form]);

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    if (!venta) return;
    try {
      await updateVenta({ id: venta.id, body: values }).unwrap();
      toast.success("Venta actualizada correctamente.");
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] w-[95vw] h-auto bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="relative bg-primary/5 p-6 border-b border-primary/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                Editar Venta
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                ID: {venta?.id.slice(0, 8)}
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
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-xl border-blue-500/10 font-bold text-secondary bg-slate-50/50">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="PENDIENTE" className="font-bold text-xs uppercase">Pendiente</SelectItem>
                        <SelectItem value="COMPLETADO" className="font-bold text-xs uppercase">Completado</SelectItem>
                        <SelectItem value="CANCELADO" className="font-bold text-xs uppercase">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        maxLength={1000}
                        className="min-h-[120px] rounded-xl border-primary/10 font-medium text-secondary bg-slate-50/50 resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
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
