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
  const [triggerSearch, { isFetching: isSearching }] =
    useLazyGetPedidoByCodigoQuery();
  const { data: sucursalesRes } = useGetBranchesSimpleQuery();
  const { data: metodosPagoRes } = useGetPaymentMethodsSimpleQuery();
  const [createVenta, { isLoading: isCreating }] = useCreateVentaMutation();

  const [nombreCliente, setNombreCliente] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState("pickup");
  const [referencia, setReferencia] = useState("");

  // Coordenadas actuales modificables
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);

  // Coordenadas originales para el botón Reset
  const [originalLat, setOriginalLat] = useState<number | null>(null);
  const [originalLng, setOriginalLng] = useState<number | null>(null);

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

  // 👇 AÑADIDO: Sacamos 'append' para poder agregar filas vacías
  const { fields, update, remove, append } = useFieldArray({
    control,
    name: "detalles",
  });

  const detallesWatch = watch("detalles");
  const totalEnvioWatch = watch("total_envio");
  const idSucursalWatch = watch("id_sucursal");
  const idMetodoWatch = watch("id_metodo_pago");
  const observacionesWatch = watch("observaciones");
  const idClienteWatch = watch("id_cliente");

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

  const handleBuscarPedido = async (codigo: string) => {
    try {
      const res = await triggerSearch(codigo).unwrap();

      const datosJson: PedidoJsonData =
        typeof res.datos_json === "string"
          ? JSON.parse(res.datos_json)
          : res.datos_json;

      toast.success(`Pedido ${codigo} cargado correctamente`);

      setValue("id_pedido", res.id);
      setValue("total_envio", datosJson.entrega.costo_envio);
      setMetodoEntrega(datosJson.entrega.metodo || "pickup");
      setReferencia(datosJson.entrega.referencia || "");

      setLatitud(datosJson.entrega.latitud || null);
      setLongitud(datosJson.entrega.longitud || null);
      setOriginalLat(datosJson.entrega.latitud || null);
      setOriginalLng(datosJson.entrega.longitud || null);

      const isInvitado = !datosJson.cliente.id_auth;
      const nombreDesdeWsp = datosJson.cliente.nombre_reserva || "Desconocido";

      if (isInvitado) {
        setValue("id_cliente", null, { shouldValidate: true });
        setNombreCliente("cliente_generico");
        setValue("observaciones", `Reserva a nombre de: ${nombreDesdeWsp}\n`);
      } else {
        setValue("id_cliente", datosJson.cliente.id_auth, {
          shouldValidate: true,
        });
        setNombreCliente(nombreDesdeWsp);
      }

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

  // 👇 NUEVO: Agregar fila vacía
  const handleAddEmptyItem = () => {
    append({
      id_producto: "",
      nombre: "",
      cantidad: 1,
      precio_final: 0,
      subtotal: 0,
    });
  };

  // 👇 NUEVO: Actualizar el ID y nombre cuando seleccionan del dropdown
  const handleUpdateProducto = (
    index: number,
    id_producto: string,
    nombre: string,
  ) => {
    const item = detallesWatch[index];
    update(index, {
      ...item,
      id_producto,
      nombre,
    });
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

  const onSubmitVenta = async (data: VentaFormValues) => {
    try {
      const etiquetaEntrega =
        metodoEntrega === "pickup" ? "RECOJO" : "DELIVERY";
      const tagCliente = data.id_cliente ? "[REGISTRADO]" : "[INVITADO]";

      const avisoMapa =
        latitud !== originalLat || longitud !== originalLng
          ? " (Ubicación ajustada en mapa)"
          : "";
      const notasCompletas = `[${etiquetaEntrega}] ${tagCliente} Nombre: ${nombreCliente} | Ref: ${referencia}${avisoMapa}\nNotas Vendedor: ${data.observaciones || "Ninguna"}`;

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
      setLatitud(null);
      setLongitud(null);
      setOriginalLat(null);
      setOriginalLng(null);
    } catch (error: any) {
      const errorMessage =
        typeof error?.data?.errors === "string"
          ? error.data.errors
          : JSON.stringify(error?.data?.errors || "Error al procesar la venta");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-slate-100 overflow-hidden font-sans">
      <div className="w-full lg:w-[65%] xl:w-[70%] h-full overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
        <div className="space-y-6 max-w-4xl">
          <BuscadorPedido
            onSearch={handleBuscarPedido}
            isLoading={isSearching}
          />

          <InfoClientCard
            idCliente={idClienteWatch ?? null}
            onClienteSelect={(id, nombre) => {
              setValue("id_cliente", id, { shouldValidate: true });
              setNombreCliente(nombre);
            }}
            onClienteClear={() => {
              setValue("id_cliente", null, { shouldValidate: true });
              setNombreCliente("");
            }}
            nombre={nombreCliente}
            metodoEntrega={metodoEntrega}
            onMetodoChange={setMetodoEntrega}
            referencia={referencia}
            onReferenciaChange={setReferencia}
            latitud={latitud}
            longitud={longitud}
            originalLat={originalLat}
            originalLng={originalLng}
            onLocationChange={(nuevoLat, nuevoLng) => {
              setLatitud(nuevoLat);
              setLongitud(nuevoLng);
            }}
          />

          <TablaProductosVenta
            items={fields as any[]}
            // 👇 NUEVAS PROPS PASADAS A LA TABLA 👇
            onAddItem={handleAddEmptyItem}
            onUpdateProducto={handleUpdateProducto}
            onUpdateCantidad={handleUpdateCantidad}
            onUpdatePrecio={handleUpdatePrecio}
            onRemoveItem={remove}
          />
        </div>
      </div>

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
