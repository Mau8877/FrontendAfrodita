import { useEffect } from "react"
import { z } from "zod"
import { useForm, useWatch, useFieldArray, type SubmitHandler } from "react-hook-form"
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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  IdCard, User as UserIcon, ShieldCheck, Trophy, 
  Power, PowerOff, Phone, MapPin, Plus, Trash2, Star, UserCog 
} from "lucide-react"
import { toast } from "sonner"
import { type User } from "../types"
import { userEditSchema } from "../schemas"
import { useUpdateUserMutation } from "../store/usersApi"
import { parseBackendErrors } from "@/utils/formatErrors"
import { useGetRolesQuery } from "../store/rolesApi"

type FormInput = z.input<typeof userEditSchema>;
type FormOutput = z.infer<typeof userEditSchema>;

interface UserEditModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserEditModal({ user, isOpen, onClose }: UserEditModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRolesQuery()
  
  const roles = Array.isArray(rolesResponse?.data) 
    ? rolesResponse?.data 
    : rolesResponse?.data?.results || []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      username: "",
      email: "",
      is_active: true,
      id_rol: "",
      perfil: { nombre: "", apellido: "", fecha_nacimiento: "", puntos_fidelidad: 0 },
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

  const isActive = useWatch({ control: form.control, name: "is_active" })

  const handleSetPrincipal = (index: number) => {
    const currentAddresses = form.getValues("direcciones") || [];
    const updated = currentAddresses.map((addr, i) => ({
      ...addr,
      es_principal: i === index
    }));
    form.setValue("direcciones", updated);
  };

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        id_rol: user.id_rol,
        perfil: {
          nombre: user.perfil?.nombre ?? "",
          apellido: user.perfil?.apellido ?? "",
          fecha_nacimiento: user.perfil?.fecha_nacimiento ?? "",
          puntos_fidelidad: user.perfil?.puntos_fidelidad ?? 0,
        },
        telefonos: user.telefonos || [],
        direcciones: user.direcciones || []
      })
    }
  }, [user, form])

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    if (!user) return
    try {
      const isRestoring = user.is_active === false && values.is_active === true;

      let payload;

      if (isRestoring) {
        payload = {
          is_active: true,
          restore: true,
          username: values.username,
          email: values.email,
        };
      } else {
        payload = { ...values };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateUser({ id: user.id, body: payload as any }).unwrap()
      
      toast.success(isRestoring ? "¡Usuario restaurado con éxito!" : "¡Usuario actualizado con éxito!")
      onClose()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string, errors?: Record<string, unknown> } };
      const backendErrors = err?.data?.errors;
      
      if (backendErrors && typeof backendErrors === "object") {
        const errorMessages = parseBackendErrors(backendErrors);
        toast.error("Por favor, revisa los campos:", {
          description: (
            <ul className="list-disc pl-4 mt-2 space-y-1.5">
              {errorMessages.map((msg, index) => (
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
      <DialogContent className="sm:max-w-[750px] w-[95vw] h-auto max-h-[95vh] bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
        
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10 relative flex-shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserIcon className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                Editar Perfil
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                Modifica los datos de identidad y roles de {user?.username}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <div className="p-6 sm:px-8 sm:pt-2 sm:pb-6 space-y-5 overflow-y-auto custom-scrollbar">
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[2px] text-primary">Credenciales</h4>
                </div>
                
                {/* Sistema de 5 columnas para dar anchos desiguales: 2 para User, 2 para Email, 1 para Rol */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  
                  {/* USERNAME (Ocupa 2/5) */}
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem className="sm:col-span-2 space-y-1">
                      <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Username</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={50} className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50" />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )} />

                  {/* EMAIL (Ocupa 2/5) */}
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="sm:col-span-2 space-y-1">
                      <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Email</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={255} className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50" />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )} />

                  {/* ROL (Ocupa 1/5 - Más estrecho) */}
                  <FormField control={form.control} name="id_rol" render={({ field }) => (
                    <FormItem className="sm:col-span-1 space-y-1">
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                        <UserCog className="w-3 h-3" /> Rol
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingRoles}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-xl border-primary/10 font-bold text-secondary bg-slate-50/50">
                            <SelectValue placeholder="Rol..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((rol: { id: string, nombre: string }) => (
                            <SelectItem key={rol.id} value={rol.id} className="font-bold text-slate-700">
                              {rol.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                   <IdCard className="w-4 h-4 text-primary" />
                   <h4 className="text-[10px] font-black uppercase tracking-[2px] text-primary">Identidad</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField control={form.control} name="perfil.nombre" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Nombre</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} maxLength={100} className="h-9 rounded-xl border-primary/10 font-bold text-secondary" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="perfil.apellido" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[9px] font-bold uppercase text-slate-400 ml-1">Apellido</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} maxLength={100} className="h-9 rounded-xl border-primary/10 font-bold text-secondary" /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="perfil.puntos_fidelidad" render={({ field }) => (
                <FormItem className="bg-secondary/5 p-3 rounded-2xl border border-secondary/10 flex items-center justify-between gap-4 space-y-0">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-secondary" />
                    <FormLabel className="text-[10px] font-black uppercase text-secondary">Puntos Fidelidad</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      type="text" 
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        field.onChange(val === "" ? 0 : parseInt(val));
                      }}
                      className="w-24 h-8 rounded-lg border-none bg-white font-black text-right text-lg text-secondary shadow-inner" 
                    />
                  </FormControl>
                </FormItem>
              )} />

              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-[2px] text-primary">Comunicación</h4>
                  </div>
                  <Button type="button" size="sm" variant="ghost" className="h-7 text-primary hover:bg-primary/5 text-[10px]" onClick={() => appendPhone({ numero: "", tipo: "Celular" })}>
                    <Plus className="w-3 h-3 mr-1" /> Añadir
                  </Button>
                </div>
                <div className="space-y-2">
                  {phoneFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Input {...form.register(`telefonos.${index}.numero`)} placeholder="Número" maxLength={20} className="h-8 rounded-xl text-xs flex-1" />
                      <Input {...form.register(`telefonos.${index}.tipo`)} placeholder="Tipo" className="h-8 rounded-xl text-xs w-28" />
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => removePhone(index)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-[2px] text-primary">Direcciones</h4>
                  </div>
                  <Button type="button" size="sm" variant="ghost" className="h-7 text-primary hover:bg-primary/5 text-[10px]" onClick={() => appendAddress({ direccion_exacta: "", es_principal: addressFields.length === 0 })}>
                    <Plus className="w-3 h-3 mr-1" /> Añadir
                  </Button>
                </div>
                <div className="space-y-2">
                  {addressFields.map((field, index) => {
                    const isPrincipal = form.watch(`direcciones.${index}.es_principal`);
                    return (
                      <div key={field.id} className={`flex gap-2 items-center p-2 rounded-xl border transition-all ${isPrincipal ? 'bg-secondary/5 border-secondary/20 shadow-sm' : 'bg-slate-50 border-primary/5'}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSetPrincipal(index)}
                          className={`h-8 w-8 rounded-lg shrink-0 ${isPrincipal ? 'text-secondary bg-white shadow-sm' : 'text-slate-300 hover:text-secondary'}`}
                        >
                          <Star className={`w-4 h-4 ${isPrincipal ? 'fill-secondary' : ''}`} />
                        </Button>
                        <Input {...form.register(`direcciones.${index}.direccion_exacta`)} placeholder="Dirección..." maxLength={255} className="h-8 rounded-lg text-xs flex-1 border-none bg-transparent focus-visible:ring-0 font-medium" />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50" 
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
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-500 ${isActive ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  </div>
                  <p className={`text-[12px] font-black uppercase ${isActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isActive ? 'Usuario Activo' : 'Usuario Inactivo'}
                  </p>
                </div>
                <FormField control={form.control} name="is_active" render={({ field }) => (
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className={`scale-110 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-rose-500`} /></FormControl>
                )} />
              </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3 flex-shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="h-9 rounded-xl font-bold uppercase text-[9px] tracking-widest">Descartar</Button>
              <Button type="submit" disabled={isLoading} className="h-9 bg-secondary text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg px-8">
                {isLoading ? "Sincronizando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}