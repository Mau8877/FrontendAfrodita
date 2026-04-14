import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

// Schemas y Types
import { ventaSchema, type VentaFormValues } from "../schemas";
import type { PedidoJsonData } from "../types";

// Store / RTK Query
import { useGetPaymentMethodsSimpleQuery } from "@/app/features/config/payment-method";
import { useGetBranchesSimpleQuery } from "@/app/features/config/branch";
import {
  useLazyGetPedidoByCodigoQuery,
  useCreateVentaMutation,
} from "../store/ventasApi";

// Componentes
import { BuscadorPedido } from "../components/BuscadorPedido";
import { InfoClientCard } from "../components/InfoClientCard";
import { TablaProductosVenta } from "../components/TablaProductosVenta";
import { CheckoutPanel } from "../components/CheckoutPanel";

export function VentasScreen() {
  // --- 1. RTK QUERY HOOKS ---
  const [triggerSearch, { isFetching: isSearching }] =
    useLazyGetPedidoByCodigoQuery();
  const { data: sucursalesRes } = useGetBranchesSimpleQuery();
  const { data: metodosPagoRes } = useGetPaymentMethodsSimpleQuery();
  const [createVenta, { isLoading: isCreating }] = useCreateVentaMutation();

  // --- 2. ESTADOS LOCALES (UI Cliente) ---
  const [nombreCliente, setNombreCliente] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState("pickup");
  const [referencia, setReferencia] = useState("");

  // --- 3. REACT HOOK FORM SETUP ---
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<VentaFormValues>({
    resolver: zodResolver(ventaSchema),
    mode: "onChange",
    defaultValues: {
      id_cliente: null,
      id_sucursal: "",
      id_metodo_pago: "",
      total_productos: 0,
      total_envio: 0,
      total_general: 0,
      detalles: [],
      observaciones: "",
    },
  });

  // Hook para manejar el array de productos dinámicamente
  const { fields, update, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  // Observamos los valores para pasarlos a los componentes y calcular
  const detallesWatch = watch("detalles");
  const totalEnvioWatch = watch("total_envio");
  const idSucursalWatch = watch("id_sucursal");
  const idMetodoWatch = watch("id_metodo_pago");
  const observacionesWatch = watch("observaciones");
  const idClienteWatch = watch("id_cliente"); // <--- NUEVO: Vigilamos el ID del cliente

  // --- 4. EFECTO: RECALCULAR TOTALES ---
  useEffect(() => {
    const subtotal = detallesWatch.reduce(
      (acc, item) => acc + item.cantidad * item.precio_final,
      0,
    );
    setValue("total_productos", subtotal, { shouldValidate: true });
    setValue("total_general", subtotal + totalEnvioWatch, {
      shouldValidate: true,
    });
  }, [detallesWatch, totalEnvioWatch, setValue]);

  // --- 5. FUNCIONES HANDLE ---
  const handleBuscarPedido = async (codigo: string) => {
    try {
      const res = await triggerSearch(codigo).unwrap();

      const datosJson: PedidoJsonData =
        typeof res.datos_json === "string"
          ? JSON.parse(res.datos_json)
          : res.datos_json;

      toast.success(`Pedido ${codigo} cargado correctamente`);

      setValue("id_pedido", res.id);
      setValue("id_cliente", datosJson.cliente.id_auth || null);
      setValue("total_envio", datosJson.entrega.costo_envio);

      setNombreCliente(datosJson.cliente.nombre_reserva || "Cliente Invitado");
      setMetodoEntrega(datosJson.entrega.metodo || "pickup");
      setReferencia(datosJson.entrega.referencia || "");

      const nuevosDetalles = datosJson.productos.map((p) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio_final: p.precio_unitario,
        subtotal: p.subtotal,
      }));
      setValue("detalles", nuevosDetalles, { shouldValidate: true });
    } catch (error: any) {
      toast.error(
        error?.data?.errors || "No se encontró el pedido o ya fue procesado",
      );
    }
  };

  const handleUpdateCantidad = (index: number, nuevaCantidad: number) => {
    const item = detallesWatch[index];
    update(index, {
      ...item,
      cantidad: nuevaCantidad,
      subtotal: nuevaCantidad * item.precio_final,
    });
  };

  const handleUpdatePrecio = (index: number, nuevoPrecio: number) => {
    const item = detallesWatch[index];
    update(index, {
      ...item,
      precio_final: nuevoPrecio,
      subtotal: item.cantidad * nuevoPrecio,
    });
  };

  // --- 6. SUBMIT VENTA ---
  const onSubmitVenta = async (data: VentaFormValues) => {
    try {
      const etiquetaEntrega =
        metodoEntrega === "pickup" ? "RECOJO" : "DELIVERY";
      // Si hay un cliente registrado, lo anotamos en las notas también por seguridad
      const tagCliente = data.id_cliente ? "[REGISTRADO]" : "[INVITADO]";
      const notasCompletas = `[${etiquetaEntrega}] ${tagCliente} Nombre: ${nombreCliente} | Ref: ${referencia}\nNotas Vendedor: ${data.observaciones || "Ninguna"}`;

      const payload: VentaFormValues = {
        ...data,
        observaciones: notasCompletas,
      };

      const res = await createVenta(payload).unwrap();
      toast.success(res.mensaje || "Venta realizada con éxito");

      reset();
      setNombreCliente("");
      setReferencia("");
      setMetodoEntrega("pickup");
    } catch (error: any) {
      const errorMessage =
        typeof error?.data?.errors === "string"
          ? error.data.errors
          : JSON.stringify(error?.data?.errors || "Error al procesar la venta");
      toast.error(errorMessage);
    }
  };

  // --- 7. RENDER ---
  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-slate-100 overflow-hidden font-sans">
      {/* COLUMNA IZQUIERDA */}
      <div className="w-full lg:w-[65%] xl:w-[70%] h-full overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Punto de Venta
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Procesa pedidos y realiza ventas rápidas
            </p>
          </div>
        </header>

        <div className="space-y-6 max-w-4xl">
          <BuscadorPedido
            onSearch={handleBuscarPedido}
            isLoading={isSearching}
          />

          <InfoClientCard
            // --- NUEVOS PROPS PARA EL BUSCADOR DE CLIENTES ---
            idCliente={idClienteWatch ?? null}
            onClienteSelect={(id, nombre) => {
              setValue("id_cliente", id, { shouldValidate: true });
              setNombreCliente(nombre);
            }}
            onClienteClear={() => {
              setValue("id_cliente", null, { shouldValidate: true });
              setNombreCliente("");
            }}
            // -------------------------------------------------
            nombre={nombreCliente}
            onNombreChange={setNombreCliente}
            metodoEntrega={metodoEntrega}
            onMetodoChange={setMetodoEntrega}
            referencia={referencia}
            onReferenciaChange={setReferencia}
          />

          <TablaProductosVenta
            items={fields as any[]}
            onUpdateCantidad={handleUpdateCantidad}
            onUpdatePrecio={handleUpdatePrecio}
            onRemoveItem={remove}
          />
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="w-full lg:w-[35%] xl:w-[30%] bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] p-6 lg:p-8 h-full overflow-y-auto">
        <CheckoutPanel
          sucursales={sucursalesRes?.data || []}
          metodosPago={metodosPagoRes?.data || []}
          selectedSucursal={idSucursalWatch}
          onSucursalChange={(val) =>
            setValue("id_sucursal", val, { shouldValidate: true })
          }
          selectedMetodo={idMetodoWatch}
          onMetodoChange={(val) =>
            setValue("id_metodo_pago", val, { shouldValidate: true })
          }
          observaciones={observacionesWatch || ""}
          onObservacionesChange={(val) => setValue("observaciones", val)}
          subtotal={watch("total_productos")}
          envio={totalEnvioWatch}
          total={watch("total_general")}
          onSubmit={handleSubmit(onSubmitVenta)}
          isLoading={isCreating}
          isValid={isValid && fields.length > 0}
        />
      </div>
    </div>
  );
}
