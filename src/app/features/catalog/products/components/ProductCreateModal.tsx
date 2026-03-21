/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { 
  PackagePlus, Palette, Plus, Star, ImageIcon, UploadCloud, 
  AlignLeft, Type, Hash, CircleDollarSign, Layers, Folders, Bookmark, Box, Trash2,
  SwatchBook
} from "lucide-react"
import { toast } from "sonner"
import { productSchema, type ProductFormValues } from "../schemas"
import { useCreateProductMutation, useGetProductSelectorsQuery } from "../store/productApi"
import { parseBackendErrors } from "@/utils/formatErrors"

// --- SUB-COMPONENTE: Previsualización Visual (SIN CAMBIOS) ---
const ImagePreviewItem = ({ 
  file, 
  isPrincipal, 
  onSetPrincipal, 
  onRemove 
}: { 
  file: File | string | null, 
  isPrincipal: boolean, 
  onSetPrincipal: () => void, 
  onRemove: () => void 
}) => {
  const previewUrl = useMemo(() => {
    if (!file) return null;
    if (typeof file === "string") return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return null;
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className={`group relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${
      isPrincipal 
        ? 'border-emerald-500 shadow-lg shadow-emerald-100 ring-4 ring-emerald-500/10 scale-[1.02]' 
        : 'border-slate-100 hover:border-emerald-200 bg-white'
    }`}>
      <img src={previewUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
        <Button type="button" variant="secondary" size="icon" className={`h-10 w-10 rounded-2xl border-none shadow-2xl transition-all hover:scale-110 ${isPrincipal ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-emerald-500'}`} onClick={(e) => { e.preventDefault(); onSetPrincipal(); }}>
          <Star className={`h-5 w-5 ${isPrincipal ? 'fill-white' : ''}`} />
        </Button>
        <Button type="button" variant="destructive" size="icon" className="h-10 w-10 rounded-2xl shadow-2xl transition-all hover:scale-110 bg-white text-rose-500 hover:bg-rose-50 border-none" onClick={(e) => { e.preventDefault(); onRemove(); }}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      {isPrincipal && (
        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-lg z-10">
          Principal
        </div>
      )}
    </div>
  );
};

interface ProductCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProductCreateModal({ isOpen, onClose }: ProductCreateModalProps) {
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const { data: selectorsResponse } = useGetProductSelectorsQuery()
  const selectors = selectorsResponse?.data || { marcas: [], categorias: [], tipos: [], colores: [], tonos: [] }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      nombre: "", descripcion: "", sku: "", precio_venta: "" as any,
      stock_minimo: 3, id_marca: undefined, id_categoria: undefined, id_tipo: "",
      colores_ids: [], tonos_ids: [], is_visible: true, imagenes_upload: []
    },
  })

  const { fields: imageFields, append, remove } = useFieldArray({
    control: form.control,
    name: "imagenes_upload"
  });

  useEffect(() => {
    const currentImages = form.getValues("imagenes_upload");
    if (currentImages && currentImages.length > 0) {
      const hasPrimary = currentImages.some(img => img.es_principal);
      if (!hasPrimary) {
        form.setValue("imagenes_upload.0.es_principal", true, { shouldValidate: true });
      }
    }
  }, [imageFields, form]);

  const handleSetPrimaryImage = (index: number) => {
    const currentImgs = form.getValues("imagenes_upload") || [];
    const updated = currentImgs.map((img, i) => ({ ...img, es_principal: i === index }));
    form.setValue("imagenes_upload", updated, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const formData = new FormData();
    formData.append('nombre', values.nombre);
    formData.append('descripcion', values.descripcion || "");
    formData.append('sku', values.sku);
    formData.append('precio_venta', String(values.precio_venta));
    formData.append('stock_minimo', String(values.stock_minimo));
    formData.append('id_tipo', values.id_tipo);
    
    // Solo enviamos si existen, de lo contrario el backend recibirá null/vacio correctamente
    if (values.id_marca) formData.append('id_marca', values.id_marca);
    if (values.id_categoria) formData.append('id_categoria', values.id_categoria);
    
    formData.append('is_visible', String(values.is_visible));
    
    values.colores_ids.forEach(id => formData.append('colores_ids', id));
    values.tonos_ids.forEach(id => formData.append('tonos_ids', id));

    values.imagenes_upload.forEach((imgObj, index) => {
      if (imgObj.imagen instanceof File) {
        formData.append(`imagenes_upload[${index}]imagen`, imgObj.imagen);
        formData.append(`imagenes_upload[${index}]es_principal`, String(imgObj.es_principal));
      }
    });

    try {
      await createProduct(formData).unwrap()
      toast.success("¡Producto registrado con éxito!")
      form.reset()
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { errors?: Record<string, string[]> } };
      if (err?.data?.errors) {
        const errorMessages = parseBackendErrors(err.data.errors);
        toast.error("Error en los campos", {
          description: <ul className="list-disc pl-4">{errorMessages.map((msg, i) => <li key={i} className="text-[10px] font-bold">{msg}</li>)}</ul>,
        });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[95vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col text-left">
        
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
              <PackagePlus className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-emerald-950 uppercase tracking-tighter leading-none">Nuevo Producto</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-1">Inventario & Activos Visuales</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 sm:px-10 space-y-8 overflow-y-auto custom-scrollbar">
              
              <div className="space-y-5 bg-slate-50/50 p-7 rounded-[2.5rem] border border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <FormField control={form.control} name="nombre" render={({ field }) => (
                    <FormItem className="sm:col-span-3 space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Type className="w-3.5 h-3.5" /> Nombre</FormLabel>
                      <FormControl><Input {...field} maxLength={255} className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem className="sm:col-span-2 space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Hash className="w-3.5 h-3.5" /> SKU</FormLabel>
                      <FormControl><Input {...field} maxLength={50} className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm uppercase font-mono" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="precio_venta" render={({ field }) => (
                    <FormItem className="sm:col-span-1 space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1.5 ml-1"><CircleDollarSign className="w-3.5 h-3.5" /> Precio</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="0.00" className="h-10 rounded-2xl font-black bg-white text-emerald-600 text-right border-emerald-100 shadow-sm"
                          onChange={(e) => {
                            let val = e.target.value.replace(',', '.').replace(/[^\d.]/g, '');
                            const dots = val.split('.');
                            if (dots.length > 2) val = dots[0] + '.' + dots.slice(1).join('');
                            field.onChange(val);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="descripcion" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><AlignLeft className="w-3.5 h-3.5" /> Descripción</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ""} maxLength={1000} className="min-h-[100px] rounded-[1.5rem] font-medium bg-white resize-none text-xs border-slate-200 shadow-sm" /></FormControl>
                    <div className="flex justify-end pr-2"><span className="text-[8px] font-bold text-slate-300 uppercase">{field.value?.length || 0} / 1000</span></div>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField control={form.control} name="id_marca" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Bookmark className="w-3.5 h-3.5" /> Marca</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none" className="font-bold text-slate-300 uppercase text-[10px]">Sin Marca / Genérico</SelectItem>
                        {selectors.marcas.map(m => <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="id_categoria" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Layers className="w-3.5 h-3.5" /> Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none" className="font-bold text-slate-300 uppercase text-[10px]">Sin Categoría</SelectItem>
                        {selectors.categorias.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="id_tipo" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Folders className="w-3.5 h-3.5" /> Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                      <SelectContent>{selectors.tipos.map(t => <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <SwatchBook className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tonos y Filtros (Catálogo)</h4>
                </div>
                <FormField control={form.control} name="tonos_ids" render={({ field }) => (
                  <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    {selectors.tonos.map(tono => (
                      <button key={tono.id} type="button" onClick={() => {
                        const next = field.value.includes(tono.id) ? field.value.filter(id => id !== tono.id) : [...field.value, tono.id];
                        field.onChange(next);
                      }} className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-300 ${field.value.includes(tono.id) ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tight">{tono.nombre}</span>
                      </button>
                    ))}
                  </div>
                )} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1"><Palette className="w-4 h-4 text-emerald-600" /><h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Colores Disponibles (Físicos)</h4></div>
                <FormField control={form.control} name="colores_ids" render={({ field }) => (
                  <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    {selectors.colores.map(color => (
                      <button key={color.id} type="button" onClick={() => {
                        const next = field.value.includes(color.id) ? field.value.filter(id => id !== color.id) : [...field.value, color.id];
                        field.onChange(next);
                      }} className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-300 ${field.value.includes(color.id) ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200'}`}>
                        <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.codigo_hex }} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{color.nombre}</span>
                      </button>
                    ))}
                  </div>
                )} />
              </div>

              <FormField control={form.control} name="stock_minimo" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Box className="w-3.5 h-3.5" /> Alerta de Stock Mínimo</FormLabel>
                  <FormControl><Input {...field} type="number" className="h-10 rounded-2xl font-bold bg-white w-full sm:w-32 border-slate-200 shadow-sm" /></FormControl>
                </FormItem>
              )} />

              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-emerald-600" /><h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Galería del Producto</h4></div>
                  <div className="relative">
                    <input type="file" id="image-upload-create" multiple accept="image/*" className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          if (file.size > 2 * 1024 * 1024) { toast.error(`${file.name} es muy grande`); return; }
                          append({ imagen: file, es_principal: imageFields.length === 0 });
                        });
                        e.target.value = "";
                      }}
                    />
                    <Button type="button" size="sm" variant="ghost" onClick={() => document.getElementById('image-upload-create')?.click()} className="h-8 text-emerald-600 text-[10px] font-black uppercase hover:bg-emerald-50 rounded-xl px-4">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Añadir Fotos
                    </Button>
                  </div>
                </div>

                {imageFields.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-7 bg-slate-50/50 rounded-[3rem] border border-slate-100">
                    {imageFields.map((field, index) => (
                      <ImagePreviewItem
                        key={field.id}
                        file={form.watch(`imagenes_upload.${index}.imagen`)}
                        isPrincipal={form.watch(`imagenes_upload.${index}.es_principal`)}
                        onSetPrincipal={() => handleSetPrimaryImage(index)}
                        onRemove={() => remove(index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div onClick={() => document.getElementById('image-upload-create')?.click()} className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30 hover:bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer group">
                    <UploadCloud className="w-14 h-14 text-slate-300 group-hover:text-emerald-500 transition-all duration-500 mb-4 group-hover:scale-110" />
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Seleccionar Archivos</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="p-7 bg-slate-50 border-t border-slate-100 gap-4 flex-shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="h-12 rounded-2xl font-bold uppercase text-[10px] text-slate-500 px-8">Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] px-12 shadow-2xl shadow-emerald-200/50">
                {isLoading ? "Creando..." : "Crear Producto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}