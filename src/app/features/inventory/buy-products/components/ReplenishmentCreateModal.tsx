/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react" 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TrendingUp, PackagePlus, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { replenishmentSchema, type ReplenishmentRequiredValues } from "../schemas"
import { useCreateReplenishmentMutation } from "../store/replenishmentApi"
import { useGetSuppliersSimpleQuery } from "@/app/features/inventory"
import { useGetProductsSimpleQuery } from "@/app/features/catalog"
import { parseBackendErrors } from "@/utils/formatErrors"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ReplenishmentCreateModal({ isOpen, onClose }: Props) {
  const [createReplenishment, { isLoading }] = useCreateReplenishmentMutation()
  
  const { data: suppliersRes } = useGetSuppliersSimpleQuery(undefined, { skip: !isOpen })
  const { data: productsRes } = useGetProductsSimpleQuery(undefined, { skip: !isOpen })

  const suppliers = suppliersRes?.data || []
  const allProducts = productsRes?.data || []

  const form = useForm<ReplenishmentRequiredValues>({
    resolver: zodResolver(replenishmentSchema) as any,
    defaultValues: {
      id_proveedor: "",
      total_operacion: 0,
      auto_prorate: true,
      detalles: []
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles"
  });

  const watchAutoProrate = form.watch("auto_prorate");
  const watchTotal = Number(form.watch("total_operacion")) || 0;
  const watchDetalles = form.watch("detalles") || [];

  const totalUnidades = watchDetalles.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
  const sumaCostosManuales = watchDetalles.reduce((acc, curr) => 
    acc + ((Number(curr.precio_costo_manual) || 0) * (Number(curr.cantidad) || 0)), 0);

  useEffect(() => {
    if (watchAutoProrate) {
      if (totalUnidades > 0 && watchTotal > 0) {
        const costoUnitarioBase = Number((watchTotal / totalUnidades).toFixed(2));
        let acumulado = 0;

        const nuevosDetalles = watchDetalles.map((d, index) => {
          if (index === watchDetalles.length - 1) {
             const costoFinal = Number(((watchTotal - acumulado) / (Number(d.cantidad) || 1)).toFixed(2));
             return { ...d, precio_costo_manual: costoFinal };
          }
          const costoItem = costoUnitarioBase;
          acumulado += (costoItem * (Number(d.cantidad) || 0));
          return { ...d, precio_costo_manual: costoItem };
        });
        
        if (JSON.stringify(nuevosDetalles) !== JSON.stringify(watchDetalles)) {
           form.setValue("detalles", nuevosDetalles);
        }
      }
    } else {
      if (Math.abs(watchTotal - sumaCostosManuales) > 0.01) {
        form.setValue("total_operacion", Number(sumaCostosManuales.toFixed(2)));
      }
    }
  }, [watchAutoProrate, watchTotal, totalUnidades, sumaCostosManuales]);

  const onSubmit: SubmitHandler<ReplenishmentRequiredValues> = async (values) => {
    try {
      await createReplenishment(values as any).unwrap()
      toast.success("¡Stock repuesto con éxito!")
      form.reset()
      onClose()
    } catch (error: any) {
      const messages = parseBackendErrors(error?.data?.errors || {});
      toast.error("Error en la reposición:", {
        description: (
          <ul className="list-disc pl-4 mt-1">
            {messages.map((msg, i) => <li key={i} className="text-[10px] font-bold">{msg}</li>)}
          </ul>
        )
      });
    }
  }

  const blockInvalidChar = (e: React.KeyboardEvent) => 
    ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[95vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col text-left">
        
        <DialogHeader className="p-6 bg-secondary/5 border-b border-secondary/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="text-secondary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Reponer Stock</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-0.5">Control de ingresos y costos Afrodita</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="flex flex-col overflow-hidden">
            <div className="p-6 sm:px-8 space-y-6 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-inner">
                <FormField control={form.control} name="id_proveedor" render={({ field }) => (
                  <FormItem className="md:col-span-5 space-y-1">
                    <FormLabel className="text-[9px] font-black uppercase text-slate-400">Proveedor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="h-10 rounded-xl font-bold bg-white"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Array.isArray(suppliers) && suppliers.map((s: any) => (
                          <SelectItem key={s.id} value={s.id} className="font-bold">{s.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="total_operacion" render={({ field }) => (
                  <FormItem className="md:col-span-3 space-y-1">
                    <FormLabel className="text-[9px] font-black uppercase text-slate-400">Total Factura (Bs)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" step="0.01" min="0" onKeyDown={blockInvalidChar} {...field}
                        disabled={!watchAutoProrate}
                        value={field.value === 0 ? "" : field.value}
                        onChange={e => field.onChange(Math.max(0, Number(e.target.value)))} 
                        className={`h-10 rounded-xl font-black text-secondary ${!watchAutoProrate ? 'bg-slate-100 border-none' : 'bg-white shadow-sm'}`} 
                      />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="auto_prorate" render={({ field }) => (
                  <FormItem className="md:col-span-4 flex flex-row items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-2 mt-auto h-10 shadow-sm">
                    <FormLabel className="text-[9px] font-black uppercase text-slate-500">Prorrateo Automático</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <PackagePlus className="w-4 h-4 text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Detalle de mercadería</h4>
                  </div>
                  <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl border-primary/20 text-primary font-bold uppercase text-[9px]"
                    onClick={() => append({ id_producto: "", cantidad: 1, ano_vencimiento: new Date().getFullYear() + 1 })}>
                    <Plus className="w-3 h-3 mr-1" /> Añadir Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white p-4 rounded-3xl border border-slate-100 shadow-sm transition-all group hover:border-secondary/30">
                      
                      <FormField control={form.control} name={`detalles.${index}.id_producto`} render={({ field: pField }) => {
                        const selectedIds = watchDetalles.map((d, i) => (i !== index ? d.id_producto : null)).filter(Boolean);
                        const availableProducts = Array.isArray(allProducts) ? allProducts.filter(p => !selectedIds.includes(p.id)) : [];
                        return (
                          <FormItem className="md:col-span-4 space-y-1">
                            <FormLabel className="text-[8px] font-black uppercase text-slate-400">Producto</FormLabel>
                            <Select onValueChange={pField.onChange} value={pField.value}>
                              <FormControl><SelectTrigger className="h-9 rounded-xl font-bold text-xs bg-slate-50/50 group-hover:bg-white"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                              <SelectContent>
                                {availableProducts.map((p: any) => (<SelectItem key={p.id} value={p.id} className="text-xs font-bold">{p.nombre}</SelectItem>))}
                                {availableProducts.length === 0 && <p className="text-[10px] p-2 text-center text-slate-400 italic">No hay más productos</p>}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }} />

                      <FormField control={form.control} name={`detalles.${index}.cantidad`} render={({ field: qField }) => (
                        <FormItem className="md:col-span-2 space-y-1">
                          <FormLabel className="text-[8px] font-black uppercase text-slate-400">Cant.</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" min="1" onKeyDown={blockInvalidChar} {...qField}
                              value={qField.value === 0 ? "" : qField.value}
                              onChange={e => qField.onChange(Math.max(1, Number(e.target.value)))} 
                              className="h-9 rounded-xl text-xs font-black" 
                            />
                          </FormControl>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`detalles.${index}.precio_costo_manual`} render={({ field: cField }) => (
                        <FormItem className="md:col-span-3 space-y-1">
                          <FormLabel className="text-[8px] font-black uppercase text-slate-400">Costo Unit. {watchAutoProrate && "(Auto)"}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" step="0.01" min="0.01" onKeyDown={blockInvalidChar} {...cField}
                              disabled={watchAutoProrate}
                              value={cField.value === undefined || cField.value === 0 ? "" : cField.value}
                              onChange={e => cField.onChange(Math.max(0.01, Number(e.target.value)))}
                              className={`h-9 rounded-xl text-xs font-black transition-all ${watchAutoProrate ? 'bg-slate-50 border-none opacity-60 text-slate-400' : 'bg-white shadow-sm'}`} 
                            />
                          </FormControl>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`detalles.${index}.ano_vencimiento`} render={({ field: yField }) => (
                        <FormItem className="md:col-span-2 space-y-1">
                          <FormLabel className="text-[8px] font-black uppercase text-slate-400">Vence (Año)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" maxLength={4} onKeyDown={blockInvalidChar} {...yField}
                              value={yField.value === 0 ? "" : yField.value}
                              onInput={(e: any) => { if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4) }}
                              onChange={e => yField.onChange(Math.max(2000, Number(e.target.value.slice(0, 4))))} 
                              className="h-9 rounded-xl text-xs font-bold" 
                            />
                          </FormControl>
                        </FormItem>
                      )} />

                      <div className="md:col-span-1 pb-1 flex justify-center">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 rounded-lg" onClick={() => remove(index)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5">
               <div className="flex gap-8">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest leading-none mb-1">Total Unidades</span>
                    <span className="text-2xl font-black text-emerald-400 leading-tight">{totalUnidades} <span className="text-xs text-white/40">PCS</span></span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest leading-none mb-1">Estado Contable</span>
                    <span className="text-2xl font-black leading-tight text-emerald-400">Bs. {watchTotal.toFixed(2)}</span>
                  </div>
               </div>
               <div className="flex gap-4 w-full sm:w-auto">
                 <Button type="button" variant="ghost" onClick={onClose} className="text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-2xl">Cancelar</Button>
                 <Button type="submit" disabled={isLoading || fields.length === 0} className="bg-secondary hover:bg-secondary/90 text-white font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-2xl shadow-2xl shadow-secondary/40 transition-all active:scale-95">
                    {isLoading ? "Procesando..." : "Confirmar Reposición"}
                 </Button>
               </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}