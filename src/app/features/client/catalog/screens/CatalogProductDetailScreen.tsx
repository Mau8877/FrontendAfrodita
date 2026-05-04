/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCartStore } from "@/app/features/client/catalog/hooks";
import { useGetProductCatalogDetailQuery } from "@/app/features/client/catalog/store";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Fingerprint,
  Minus,
  PackageCheck,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Tags,
  Truck,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function CatalogProductDetailScreen() {
  const { productId } = useParams({
    from: "/_main/_client/catalog/product/$productId",
  });
  const { data, isLoading, error } = useGetProductCatalogDetailQuery(productId);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    transformOrigin: "0% 0%",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const product = data?.data;
  const imagenes = product?.imagenes || [];

  // Lógica de Zustand y Stock
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.id === product?.id);
  const isInCart = Boolean(cartItem);

  const stockDisponible = (product as any)?.stock_disponible ?? 0;
  const isOutOfStock = stockDisponible <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !product) return;
    addItem(product, 1);
    toast.success(`Añadido: ${product.nombre} al Carrito`, {
      duration: 2000,
      style: { borderRadius: "1.5rem", fontFamily: "Poppins" },
    });
  };

  const handleIncrement = () => {
    if (!product) return;
    addItem(product, 1);
  };

  const handleDecrement = () => {
    if (!cartItem || !product) return;
    if (cartItem.cantidad === 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, cartItem.cantidad - 1);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.nombre,
          text: `Mira este producto: ${product?.nombre}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOutOfStock) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ display: "block", transformOrigin: `${x}% ${y}%` });
  };

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (error || !product)
    return (
      <div className="p-20 text-center font-black uppercase text-rose-500 text-xs">
        Producto no disponible
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* HEADER */}
      <header className="w-full px-6 pt-6 flex-shrink-0">
        <Link
          to="/catalog"
          className="group text-slate-400 hover:text-secondary transition-colors font-black text-[9px] uppercase tracking-[0.2em] flex items-center w-fit"
        >
          <ArrowLeft className="mr-2 w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Volver al Catálogo
        </Link>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex items-start lg:items-center justify-center w-full px-6 lg:px-8 py-2 lg:py-2">
        <main className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-center">
          {/* BLOQUE TÍTULO Y PRECIO (Móvil únicamente) */}
          <div className="flex flex-col space-y-3 lg:hidden order-first text-center">
            <div className="space-y-1">
              <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">
                {product.nombre_tipo}
              </span>
              <h1
                className={`text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight ${isOutOfStock ? "opacity-50" : ""}`}
              >
                {product.nombre}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div
                className={`text-3xl font-black text-slate-900 tracking-tighter ${isOutOfStock ? "opacity-50" : ""}`}
              >
                Bs. {Number(product.precio_venta).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    isOutOfStock
                      ? "text-slate-400 bg-slate-50 border-slate-200"
                      : "text-emerald-600 bg-emerald-50 border-emerald-100"
                  }`}
                >
                  {isOutOfStock ? (
                    <XCircle size={10} />
                  ) : (
                    <Check size={10} strokeWidth={3} />
                  )}
                  {isOutOfStock ? "Agotado" : "Disponible"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className={`h-8 w-8 rounded-full border ${isShared ? "text-green-500 border-green-200 bg-green-50" : "text-slate-400 border-slate-100"}`}
                >
                  <Share2 size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* COLUMNA IZQUIERDA - Galería e Imagen */}
          <div className="flex flex-col space-y-4 lg:order-none">
            <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start">
              {/* SELECTOR DE IMÁGENES */}
              {imagenes.length > 1 && (
                <div className="flex lg:flex-col gap-2 order-last lg:order-first overflow-x-auto lg:overflow-x-visible py-1 lg:py-0 w-full lg:w-fit justify-center">
                  {imagenes.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`relative w-12 h-12 lg:w-16 lg:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentImgIndex === idx
                          ? "border-secondary shadow-md scale-105"
                          : "border-slate-100 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.imagen}
                        className={`w-full h-full object-cover ${isOutOfStock ? "grayscale" : ""}`}
                        alt={`Vista ${idx + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* IMAGEN PRINCIPAL */}
              <div className="flex-grow max-w-[360px] lg:max-w-full w-full">
                <div
                  ref={containerRef}
                  className={`relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm touch-pinch-zoom ${isOutOfStock ? "grayscale-[0.8] opacity-90" : "lg:cursor-zoom-in"}`}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() =>
                    setZoomStyle({ ...zoomStyle, display: "none" })
                  }
                >
                  {/* BANNER DIAGONAL */}
                  {isOutOfStock && (
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden z-20 pointer-events-none">
                      <div className="absolute top-6 -right-10 bg-slate-900 text-white text-[10px] font-black py-1.5 w-40 text-center transform rotate-45 shadow-xl uppercase tracking-widest">
                        Agotado
                      </div>
                    </div>
                  )}

                  {product.nombre_marca && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] text-secondary shadow-sm border border-secondary/20 flex items-center gap-1.5">
                        <Tag className="w-2.5 h-2.5" />
                        {product.nombre_marca}
                      </span>
                    </div>
                  )}

                  <img
                    src={imagenes[currentImgIndex]?.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover pointer-events-auto"
                  />

                  {!isOutOfStock && (
                    <div
                      className="absolute inset-0 pointer-events-none hidden md:block"
                      style={{
                        ...zoomStyle,
                        backgroundImage: `url(${imagenes[currentImgIndex]?.imagen})`,
                        backgroundSize: "220%",
                        backgroundPosition: zoomStyle.transformOrigin,
                        backgroundRepeat: "no-repeat",
                        display:
                          zoomStyle.display === "block" ? "block" : "none",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Colores (SOLO MÓVIL) */}
            {product.colores?.length > 0 && (
              <div className="space-y-3 pt-2 lg:hidden">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block text-center">
                  Colores del lente
                </span>
                <div className="flex flex-wrap justify-center gap-4">
                  {product.colores.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100"
                        style={{ backgroundColor: c.codigo_hex }}
                      />
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                        {c.nombre}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA - Info producto */}
          <div className="flex flex-col space-y-6">
            {/* Título y Precio (Desktop únicamente) */}
            <div className="hidden lg:flex flex-col space-y-4">
              <div className="space-y-1">
                <span className="text-secondary font-black text-[12px] uppercase tracking-[0.4em]">
                  {product.nombre_tipo}
                </span>
                <h1
                  className={`text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[1.1] ${isOutOfStock ? "opacity-50" : ""}`}
                >
                  {product.nombre}
                </h1>
              </div>
              <div className="flex items-center gap-5">
                <div
                  className={`text-4xl font-black text-slate-900 tracking-tighter ${isOutOfStock ? "opacity-50" : ""}`}
                >
                  Bs. {Number(product.precio_venta).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                      isOutOfStock
                        ? "text-slate-400 bg-slate-50 border-slate-200"
                        : "text-emerald-600 bg-emerald-50 border-emerald-100"
                    }`}
                  >
                    {isOutOfStock ? (
                      <XCircle size={12} />
                    ) : (
                      <Check size={12} strokeWidth={3} />
                    )}
                    {isOutOfStock ? "Agotado" : "Disponible"}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className={`h-9 w-9 rounded-xl border transition-all ${isShared ? "text-green-500 border-green-200 bg-green-50" : "text-slate-400 border-slate-100 hover:text-secondary hover:border-secondary"}`}
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`space-y-3 pt-4 lg:border-t lg:border-slate-50 ${isOutOfStock ? "opacity-60" : ""}`}
            >
              {product.nombre_marca && (
                <div className="flex items-center gap-6 text-[11px]">
                  <span className="font-bold text-slate-400 uppercase w-24 flex items-center gap-2">
                    <Tag size={12} className="text-slate-300" /> Marca:
                  </span>
                  <span className="font-black text-slate-700 uppercase">
                    {product.nombre_marca}
                  </span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center gap-6 text-[11px]">
                  <span className="font-bold text-slate-400 uppercase w-24 flex items-center gap-2">
                    <Fingerprint size={12} className="text-slate-300" /> SKU:
                  </span>
                  <span className="font-black text-slate-700 uppercase tracking-widest">
                    {product.sku}
                  </span>
                </div>
              )}
              {product.categorias?.length > 0 && (
                <div className="flex items-center gap-6 text-[11px]">
                  <span className="font-bold text-slate-400 uppercase w-24 flex items-center gap-2">
                    <Tags
                      size={14}
                      strokeWidth={2.2}
                      className="text-slate-300 shrink-0"
                    />{" "}
                    Categorías:
                  </span>
                  <span className="font-black text-slate-700 uppercase">
                    {product.categorias
                      .map((categoria: any) => categoria.nombre)
                      .join(", ")}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-slate-50">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2 tracking-widest">
                  Descripción técnica:
                </span>
                <p className="text-slate-500 text-xs leading-relaxed font-medium italic">
                  {product.descripcion || "Sin descripción disponible."}
                </p>
              </div>

              {/* Colores (SOLO WEB) */}
              {product.colores?.length > 0 && (
                <div className="hidden lg:block pt-4">
                  <span className="font-bold text-slate-400 uppercase text-[8px] block mb-3 tracking-widest">
                    Colores del lente:
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {product.colores.map((c: any) => (
                      <div
                        key={c.id}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-6 h-6 rounded-full border-1 border-white shadow-sm ring-1 ring-slate-100"
                          style={{ backgroundColor: c.codigo_hex }}
                        />
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                          {c.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BENEFICIOS */}
            <div
              className={`flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10 pt-2 ${isOutOfStock ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">
                  Envío Inmediato
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">
                  100% Original
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck size={18} className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">
                  Sellados en caja
                </span>
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN / CONTROLES DE CANTIDAD */}
            <div className="pt-4 flex justify-center lg:justify-start pb-8">
              {isOutOfStock ? (
                <Button
                  disabled
                  className="w-full max-sm:max-w-full max-w-sm h-14 rounded-full font-black uppercase text-xs tracking-[0.2em] bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                >
                  Próximamente disponible
                </Button>
              ) : isInCart ? (
                <div className="flex items-center justify-between bg-secondary/10 rounded-full h-14 w-full max-sm:max-w-full max-w-sm px-2 border border-secondary/20 animate-in fade-in zoom-in duration-300">
                  <Button
                    variant="ghost"
                    onClick={handleDecrement}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-white text-secondary transition-colors shrink-0"
                  >
                    <Minus className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>

                  <span className="text-base md:text-lg font-black text-secondary text-center px-4 w-12 shrink-0">
                    {cartItem?.cantidad}
                  </span>

                  <Button
                    variant="ghost"
                    onClick={handleIncrement}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-white text-secondary transition-colors shrink-0"
                  >
                    <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="w-full max-sm:max-w-full max-w-sm h-14 rounded-full font-black uppercase text-xs tracking-[0.2em] bg-secondary hover:bg-[#5a2ab1] text-white shadow-xl shadow-secondary/20 transition-transform active:scale-95"
                >
                  <ShoppingCart size={18} className="mr-3" strokeWidth={2.5} />
                  Añadir al carrito
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
