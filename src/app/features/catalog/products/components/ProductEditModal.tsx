/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
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
  Package, Palette, Plus, Star, ImageIcon,
  Type, Hash, CircleDollarSign, AlignLeft, Bookmark, Layers, Folders, Trash2, RefreshCcw,
  SwatchBook
} from "lucide-react"
import { toast } from "sonner"
import { type Product, type ProductSelectors } from "../types" 
import { productSchema, type ProductFormValues } from "../schemas"
import { useUpdateProductMutation, useGetProductSelectorsQuery } from "../store/productApi"
import { parseBackendErrors } from "@/utils/formatErrors"

// --- SUB-COMPONENTE: PREVISUALIZACIÓN ---
const ImagePreviewItem = ({ 
  file, isPrincipal, onSetPrincipal, onRemove 
}: { 
  file: File | string | null, isPrincipal: boolean, onSetPrincipal: () => void, onRemove: () => void 
}) => {
  const [localDataUrl, setLocalDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (file instanceof File) {
      let isMounted = true;
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMounted && typeof reader.result === "string") setLocalDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
      return () => { isMounted = false; };
    }
  }, [file]);

  const previewUrl = typeof file === "string" ? file : (file instanceof File ? localDataUrl : null);

  if (!previewUrl || error) {
    return (
      <div className="relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2">
        <ImageIcon className={`w-8 h-8 ${!previewUrl ? 'text-slate-300 animate-pulse' : 'text-slate-200'}`} />
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="absolute top-2 right-2 h-7 w-7 text-rose-400 rounded-full">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`group relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all duration-500 bg-white ${
      isPrincipal ? 'border-secondary shadow-lg ring-4 ring-secondary/5 scale-[1.02]' : 'border-slate-100'
    }`}>
      <img src={previewUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={() => setError(true)} />
      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
        <Button type="button" variant="secondary" size="icon" className={`h-10 w-10 rounded-2xl ${isPrincipal ? 'bg-secondary text-white' : 'bg-white text-slate-400 hover:text-secondary'}`} onClick={(e) => { e.preventDefault(); onSetPrincipal(); }}>
          <Star className={`h-5 w-5 ${isPrincipal ? 'fill-white' : ''}`} />
        </Button>
        <Button type="button" variant="destructive" size="icon" className="h-10 w-10 rounded-2xl bg-white text-rose-500" onClick={(e) => { e.preventDefault(); onRemove(); }}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      {isPrincipal && <div className="absolute top-4 left-4 bg-secondary text-white text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-lg z-10">Principal</div>}
    </div>
  );
};

interface ProductEditModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductEditModal({ product, isOpen, onClose }: ProductEditModalProps) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation()
  const { data: selectorsResponse } = useGetProductSelectorsQuery()
  
  // Usamos el tipo ProductSelectors para que TypeScript sepa qué hay en marcas, categorias, etc.
  const selectors: ProductSelectors = selectorsResponse?.data || { marcas: [], categorias: [], tipos: [], colores: [], tonos: [] }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      nombre: "", descripcion: "", sku: "", precio_venta: "" as any,
      stock_minimo: 3, id_marca: "none", id_tipo: "",
      categorias_ids: [], colores_ids: [], tonos_ids: [], is_visible: true, imagenes_upload: []
    },
  })

  const { fields: imageFields, append, remove } = useFieldArray({
    control: form.control,
    name: "imagenes_upload"
  });

  useEffect(() => {
    if (product && isOpen) {
      // Sincronización crucial: Si el campo es null en DB, lo pasamos a "none" para el Select
      const marcaVal = product.id_marca || "none";
      form.reset({
        nombre: product.nombre,
        descripcion: product.descripcion || "",
        sku: product.sku,
        precio_venta: product.precio_venta as any,
        stock_minimo: product.stock_minimo,
        id_marca: marcaVal,
        id_tipo: product.id_tipo,
        categorias_ids: (product.categorias || []).map((c: { id: string }) => c.id),
        // Tipamos explícitamente los elementos del array para el .map()
        colores_ids: (product.colores || []).map((c: { id: string }) => c.id),
        tonos_ids: (product.tonos || []).map((t: { id: string }) => t.id),
        is_visible: product.is_visible,
        imagenes_upload: (product.imagenes || []).map(img => ({
          imagen: img.imagen,
          es_principal: img.es_principal
        }))
      })
    }
  }, [product, isOpen, form])

  const handleSetPrimaryImage = (index: number) => {
    const currentImgs = form.getValues("imagenes_upload") || [];
    const updated = currentImgs.map((img, i) => ({ ...img, es_principal: i === index }));
    form.setValue("imagenes_upload", updated, { shouldValidate: true });
  };

  const handleRemoveImage = (index: number) => {
    const imgs = form.getValues("imagenes_upload");
    const wasPrincipal = imgs[index]?.es_principal;
    remove(index);
    if (wasPrincipal && imgs.length > 1) {
      setTimeout(() => {
        const newImgs = form.getValues("imagenes_upload");
        if (newImgs.length > 0) form.setValue("imagenes_upload.0.es_principal", true, { shouldValidate: true });
      }, 0);
    }
  }

  const handleRestore = async () => {
    if (!product) return;
    try {
      await updateProduct({ id: product.id, body: { restore: true } as any }).unwrap();
      toast.success("¡Producto restaurado!");
      onClose();
    } catch {
      toast.error("No se pudo restaurar.");
    }
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    if (!product) return;
    const formData = new FormData();
    formData.append('nombre', values.nombre);
    formData.append('descripcion', values.descripcion || "");
    formData.append('sku', values.sku);
    formData.append('precio_venta', String(values.precio_venta));
    formData.append('stock_minimo', String(values.stock_minimo));
    formData.append('id_tipo', values.id_tipo);
    
    // Al enviar, si es "none", mandamos string vacío para que Django guarde NULL
    formData.append('id_marca', values.id_marca === "none" ? "" : (values.id_marca || ""));
    values.categorias_ids.forEach(id => formData.append('categorias_ids', id));
    
    formData.append('is_visible', String(values.is_visible));

    values.colores_ids.forEach(id => formData.append('colores_ids', id));
    values.tonos_ids.forEach(id => formData.append('tonos_ids', id));

    values.imagenes_upload.forEach((imgObj, index) => {
      if (imgObj.imagen instanceof File) {
        formData.append(`imagenes_upload[${index}]imagen`, imgObj.imagen);
      } else if (typeof imgObj.imagen === "string") {
        formData.append(`imagenes_upload[${index}]imagen_url`, imgObj.imagen);
      }
      formData.append(`imagenes_upload[${index}]es_principal`, String(imgObj.es_principal));
    });

    try {
      await updateProduct({ id: product.id, body: formData }).unwrap();
      toast.success("¡Producto actualizado!");
      onClose();
    } catch (error: any) {
      if (error?.data?.errors) {
        const errorMessages = parseBackendErrors(error.data.errors);
        toast.error("Error al actualizar", {
          description: <ul className="list-disc pl-4">{errorMessages.map((msg, i) => <li key={i} className="text-[10px] font-bold">{msg}</li>)}</ul>,
        });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[95vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col text-left text-slate-900">
        <DialogHeader className="p-6 bg-secondary/5 border-b border-secondary/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/10">
              <Package className="text-secondary w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-secondary uppercase tracking-tighter leading-none">Editar Producto</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sincronización de Stock y Activos</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 sm:px-10 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Banner Papelera */}
              {product?.deleted_at && (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><RefreshCcw className="w-4 h-4" /></div>
                    <p className="text-[11px] font-black uppercase text-emerald-700">Producto en Papelera</p>
                  </div>
                  <Button type="button" onClick={handleRestore} className="h-8 bg-emerald-600 text-white rounded-xl text-[9px] px-4 font-black">Restaurar</Button>
                </div>
              )}

              {/* Datos Principales */}
              <div className="space-y-5 bg-slate-50/50 p-7 rounded-[2.5rem] border border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <FormField control={form.control} name="nombre" render={({ field }) => (
                    <FormItem className="sm:col-span-3 space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Type className="w-3.5 h-3.5" /> Nombre</FormLabel>
                      <FormControl><Input {...field} className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem className="sm:col-span-2 space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Hash className="w-3.5 h-3.5" /> SKU</FormLabel>
                      <FormControl><Input {...field} className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm uppercase font-mono" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="precio_venta" render={({ field }) => (
                    <FormItem className="sm:col-span-1 space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1.5 ml-1"><CircleDollarSign className="w-3.5 h-3.5" /> Precio</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="h-10 rounded-2xl font-black bg-white text-emerald-600 text-right border-emerald-100 shadow-sm"
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
                    <FormControl><Textarea {...field} value={field.value ?? ""} className="min-h-[100px] rounded-[1.5rem] font-medium bg-white resize-none text-xs border-slate-200 shadow-sm" /></FormControl>
                  </FormItem>
                )} />
              </div>

              {/* Selectores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField control={form.control} name="id_marca" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Bookmark className="w-3.5 h-3.5" /> Marca</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none" className="font-bold text-slate-300 uppercase text-[10px]">Sin Marca</SelectItem>
                        {selectors.marcas.map((m) => <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="id_tipo" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1"><Folders className="w-3.5 h-3.5" /> Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="h-10 rounded-2xl font-bold bg-white border-slate-200 shadow-sm"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                      <SelectContent>{selectors.tipos.map((t) => <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1"><Layers className="w-4 h-4 text-secondary" /><h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Categorias</h4></div>
                <FormField control={form.control} name="categorias_ids" render={({ field }) => (
                  <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    {selectors.categorias.map((categoria) => (
                      <button key={categoria.id} type="button" onClick={() => {
                        const next = field.value.includes(categoria.id) ? field.value.filter(id => id !== categoria.id) : [...field.value, categoria.id];
                        field.onChange(next);
                      }} className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-300 ${field.value.includes(categoria.id) ? 'bg-secondary text-white border-secondary shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-secondary/50'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tight">{categoria.nombre}</span>
                      </button>
                    ))}
                  </div>
                )} />
              </div>

              {/* Tonos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1"><SwatchBook className="w-4 h-4 text-secondary" /><h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tonos</h4></div>
                <FormField control={form.control} name="tonos_ids" render={({ field }) => (
                  <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    {selectors.tonos.map((tono) => (
                      <button key={tono.id} type="button" onClick={() => {
                        const next = field.value.includes(tono.id) ? field.value.filter(id => id !== tono.id) : [...field.value, tono.id];
                        field.onChange(next);
                      }} className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-300 ${field.value.includes(tono.id) ? 'bg-secondary text-white border-secondary shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-secondary/50'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tight">{tono.nombre}</span>
                      </button>
                    ))}
                  </div>
                )} />
              </div>

              {/* Colores */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1"><Palette className="w-4 h-4 text-secondary" /><h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Variantes de Color</h4></div>
                <FormField control={form.control} name="colores_ids" render={({ field }) => (
                  <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    {selectors.colores.map((color) => (
                      <button key={color.id} type="button" onClick={() => {
                        const next = field.value.includes(color.id) ? field.value.filter(id => id !== color.id) : [...field.value, color.id];
                        field.onChange(next);
                      }} className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-300 ${field.value.includes(color.id) ? 'bg-secondary text-white border-secondary shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-secondary/50'}`}>
                        <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.codigo_hex }} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{color.nombre}</span>
                      </button>
                    ))}
                  </div>
                )} />
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between px-1"><div className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-secondary" /><h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Galería</h4></div>
                  <input type="file" id="image-upload-edit-final" multiple accept="image/*" className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        if (file.size > 2 * 1024 * 1024) { toast.error(`${file.name} es muy grande`); return; }
                        append({ imagen: file, es_principal: imageFields.length === 0 });
                      });
                      e.target.value = "";
                    }}
                  />
                  <Button type="button" size="sm" variant="ghost" onClick={() => document.getElementById('image-upload-edit-final')?.click()} className="h-8 text-secondary text-[10px] font-black uppercase hover:bg-secondary/5 rounded-xl px-4 border border-secondary/10">
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Añadir Fotos
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-7 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner">
                  {imageFields.map((field, index) => (
                    <ImagePreviewItem
                      key={field.id}
                      file={form.watch(`imagenes_upload.${index}.imagen`)}
                      isPrincipal={form.watch(`imagenes_upload.${index}.es_principal`)}
                      onSetPrincipal={() => handleSetPrimaryImage(index)}
                      onRemove={() => handleRemoveImage(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="p-7 bg-slate-50 border-t border-slate-100 gap-4 flex-shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="h-12 rounded-2xl font-bold uppercase text-[10px] text-slate-500 px-8 hover:bg-slate-100">Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="h-12 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-black uppercase text-[10px] px-12 shadow-2xl shadow-secondary/20 transition-all active:scale-95">
                {isLoading ? "Sincronizando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
