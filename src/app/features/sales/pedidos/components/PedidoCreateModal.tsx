import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseBackendErrors } from "@/utils/formatErrors";
import { pedidoCreateSchema } from "../schemas";
import { useCreatePedidoGestionMutation } from "../store";

type FormInput = z.input<typeof pedidoCreateSchema>;
type FormOutput = z.infer<typeof pedidoCreateSchema>;

interface PedidoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PedidoCreateModal({ isOpen, onClose }: PedidoCreateModalProps) {
  const [createPedidoGestion, { isLoading }] = useCreatePedidoGestionMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(pedidoCreateSchema),
    defaultValues: {
      nombre_cliente: "",
      items_json: '[{"id":"", "cantidad":1}]',
      entrega_json: '{"metodo":"DELIVERY","costo_envio":0}',
    },
  });

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    try {
      const body = {
        nombre_cliente: values.nombre_cliente,
        items: JSON.parse(values.items_json),
        entrega: JSON.parse(values.entrega_json),
      };
      const res = await createPedidoGestion(body).unwrap();
      toast.success(`Pedido ${res.codigo} enviado`);
      form.reset();
      onClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string; errors?: Record<string, unknown> } };
      const backendErrors = err?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Error al registrar pedido:", {
          description: (
            <ul className="list-disc pl-4 mt-1 space-y-1">
              {errorMessages.map((msg, index) => (
                <li key={index} className="text-xs font-bold text-slate-700 leading-snug">{msg}</li>
              ))}
            </ul>
          ),
        });
      } else {
        toast.error(err?.data?.message || "Error al crear pedido.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] w-[95vw] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Plus className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-emerald-900 uppercase tracking-tighter leading-none">
                Nuevo Pedido
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">
                Registro manual técnico para pruebas de gestión.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
            <div className="p-6 space-y-4 flex-grow overflow-y-auto custom-scrollbar">
              <FormField
                control={form.control}
                name="nombre_cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Nombre Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11 rounded-2xl font-bold bg-slate-50 border-slate-100" />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="items_json"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Items JSON</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[120px] rounded-2xl font-mono text-[11px] bg-slate-50 border-slate-100" />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entrega_json"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Entrega JSON</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px] rounded-2xl font-mono text-[11px] bg-slate-50 border-slate-100" />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="h-10 rounded-xl font-bold uppercase text-[10px]">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] px-10">
                {isLoading ? "Registrando..." : "Guardar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
