import { z } from "zod"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { 
  UserPlus, ShieldCheck, IdCard, 
  Phone, MapPin, Plus, Trash2, KeyRound, UserCog, Star 
} from "lucide-react"
import { toast } from "sonner"
import { userCreateSchema } from "../schemas"
import { useCreateUserMutation } from "../store/usersApi"
import { parseBackendErrors } from "@/utils/formatErrors"
import { useGetRolesQuery } from "../store/rolesApi" 

type FormInput = z.input<typeof userCreateSchema>;
type FormOutput = z.infer<typeof userCreateSchema>;

interface UserCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserCreateModal({ isOpen, onClose }: UserCreateModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation()
  const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRolesQuery()
  
  const roles = Array.isArray(rolesResponse?.data) 
    ? rolesResponse?.data 
    : rolesResponse?.data?.results || []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      id_rol: undefined,
      is_active: true,
      perfil: { 
        nombre: "", 
        apellido: "", 
        fecha_nacimiento: "", 
        puntos_fidelidad: 0 
      },
      telefonos: [],
      direcciones: []
    },
  })

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control: form.control,
    name: "telefonos"
  });

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control: form.control,
    name: "direcciones"
  });

  const handleSetPrincipal = (index: number) => {
    const currentAddresses = form.getValues("direcciones") || [];
    const updated = currentAddresses.map((addr, i) => ({
      ...addr,
      es_principal: i === index
    }));
    form.setValue("direcciones", updated);
  };

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    try {
      await createUser(values).unwrap()
      toast.success("¡Nuevo ninja reclutado con éxito!")
      form.reset()
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string, errors?: Record<string, unknown> } };
      const backendErrors = err?.data?.errors;
      
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Por favor, revisa los campos:", {
          description: (
            <ul className="list-disc pl-4 mt-1 space-y-1">
              {errorMessages.map((msg: string, index: number) => (
                <li key={index} className="text-xs font-bold text-slate-700 leading-snug">{msg}</li>
              ))}
            </ul>
          ),
          duration: 6000,
        });
      } else {
        toast.error(err?.data?.message || "Error al procesar la solicitud.");
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        <DialogHeader className="p-6 bg-emerald-500/5 border-b border-emerald-500/10 flex-shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <UserPlus className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-emerald-900 uppercase tracking-tighter leading-none">
                Nuevo Usuario
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">
                Registro de nuevos miembros para el sistema Afrodita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 sm:px-8 space-y-6 overflow-y-auto custom-scrollbar">
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">Credenciales de Acceso</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem className="sm:col-span-2 space-y-1">
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400 ml-1">Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="satoru_77" maxLength={50} onChange={(e) => field.onChange(e.target.value.substring(0, 50))} className="h-9 rounded-xl font-bold bg-white" />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="sm:col-span-2 space-y-1">
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400 ml-1">Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="correo@ejemplo.com" maxLength={255} onChange={(e) => field.onChange(e.target.value.substring(0, 255))} className="h-9 rounded-xl font-bold bg-white" />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="id_rol" render={({ field }) => (
                    <FormItem className="sm:col-span-1 space-y-1">
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400 ml-1"><UserCog className="w-3 h-3 inline mr-1" /> Rol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingRoles}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-xl font-bold bg-white border-slate-200"><SelectValue placeholder="..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((rol: { id: string, nombre: string }) => (
                            <SelectItem key={rol.id} value={rol.id} className="font-bold text-slate-700 cursor-pointer">{rol.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                   <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><KeyRound className="w-3 h-3" /> Contraseña</FormLabel>
                      <FormControl><Input {...field} type="password" placeholder="••••••••" className="h-9 rounded-xl font-bold" /></FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 px-1">
                  <IdCard className="w-4 h-4 text-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Información de Perfil</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="perfil.nombre" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Nombres</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} maxLength={100} onChange={(e) => field.onChange(e.target.value.substring(0, 100))} className="h-9 rounded-xl font-bold" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="perfil.apellido" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Apellidos</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} maxLength={100} onChange={(e) => field.onChange(e.target.value.substring(0, 100))} className="h-9 rounded-xl font-bold" /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-secondary" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Teléfonos</h4>
                    </div>
                    <Button type="button" size="sm" variant="ghost" className="h-6 text-[10px] font-bold uppercase text-secondary" onClick={() => appendPhone({ numero: "", tipo: "Celular" })}>
                      <Plus className="w-3 h-3 mr-1" /> Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {phoneFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <FormField
                          control={form.control}
                          name={`telefonos.${index}.tipo`}
                          render={({ field: typeField }) => (
                            <FormControl>
                              <Input 
                                {...typeField} 
                                placeholder="Tipo" 
                                maxLength={20} 
                                onChange={(e) => typeField.onChange(e.target.value.substring(0, 20))}
                                className="h-8 rounded-lg text-[10px] w-24 bg-white border-slate-200 font-semibold" 
                              />
                            </FormControl>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`telefonos.${index}.numero`}
                          render={({ field: numField }) => (
                            <FormControl>
                              <Input 
                                {...numField} 
                                placeholder="Número" 
                                maxLength={20} 
                                onChange={(e) => numField.onChange(e.target.value.substring(0, 20))}
                                className="h-8 rounded-lg text-xs flex-1 bg-transparent border-none focus-visible:ring-0" 
                              />
                            </FormControl>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-rose-500" onClick={() => removePhone(index)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Direcciones</h4>
                    </div>
                    <Button type="button" size="sm" variant="ghost" className="h-6 text-[10px] font-bold uppercase text-secondary" onClick={() => appendAddress({ direccion_exacta: "", es_principal: addressFields.length === 0 })}>
                      <Plus className="w-3 h-3 mr-1" /> Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {addressFields.map((field, index) => {
                      const isPrincipal = form.watch(`direcciones.${index}.es_principal`);
                      return (
                        <div key={field.id} className={`flex gap-2 items-center p-2 rounded-xl border transition-all ${isPrincipal ? 'bg-secondary/5 border-secondary/20 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSetPrincipal(index)}
                            className={`h-7 w-7 rounded-lg shrink-0 ${isPrincipal ? 'text-secondary bg-white shadow-sm' : 'text-slate-300 hover:text-secondary'}`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isPrincipal ? 'fill-secondary' : ''}`} />
                          </Button>
                          <FormField
                            control={form.control}
                            name={`direcciones.${index}.direccion_exacta`}
                            render={({ field: dirField }) => (
                              <FormControl>
                                <Input 
                                  {...dirField} 
                                  placeholder="Dirección..." 
                                  maxLength={255} 
                                  onChange={(e) => dirField.onChange(e.target.value.substring(0, 255))}
                                  className="h-8 rounded-lg text-xs flex-1 border-none bg-transparent focus-visible:ring-0 font-medium" 
                                />
                              </FormControl>
                            )}
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-rose-500" 
                            onClick={() => {
                              const wasPrincipal = form.getValues(`direcciones.${index}.es_principal`);
                              removeAddress(index);
                              if (wasPrincipal) {
                                setTimeout(() => {
                                  const remaining = form.getValues("direcciones");
                                  if (remaining && remaining.length > 0) handleSetPrincipal(0);
                                }, 10);
                              }
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="h-10 rounded-xl font-bold uppercase text-[10px]">Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] px-10 shadow-lg shadow-emerald-200">
                {isLoading ? "Creando..." : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}