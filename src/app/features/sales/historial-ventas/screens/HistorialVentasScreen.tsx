import { type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Check, Copy, History } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GenericDeleteModal } from "@/components/GenericDeleteModal";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { VentaDetailModal, VentaEditModal } from "../components";
import { useDeleteVentaMutation, useGetVentasHistoryQuery } from "../store";
import type { Venta } from "../types";

const ESTADO_STYLE: Record<Venta["estado"], string> = {
  PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200",
  COMPLETADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELADO: "bg-rose-100 text-rose-700 border-rose-200",
};

const ESTADO_LABEL: Record<Venta["estado"], string> = {
  PENDIENTE: "Pendiente",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

export const HistorialVentasScreen = () => {
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [ventaToEdit, setVentaToEdit] = useState<Venta | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [ventaToDetail, setVentaToDetail] = useState<Venta | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState<Venta | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteVenta] = useDeleteVentaMutation();

  const ordering = sorting.length ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}` : undefined;
  const { data: apiResponse, isFetching, refetch } = useGetVentasHistoryQuery({
    page: page + 1,
    ordering,
    search: appliedSearch || undefined,
  });

  const handleSearchTrigger = () => {
    setPage(0);
    setAppliedSearch(searchValue);
  };

  // Soporta ambos formatos:
  // 1) StandardResponse => { success, data: { count, results } }
  // 2) DRF paginado     => { count, results }
  const ventas = (apiResponse as any)?.data?.results || (apiResponse as any)?.results || [];
  const totalCount = (apiResponse as any)?.data?.count ?? (apiResponse as any)?.count ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("ID de venta copiado");
    setTimeout(() => setCopiedId(null), 1800);
  };

  const columns: ColumnDef<Venta>[] = [
    {
      accessorKey: "id",
      header: "ID Venta",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 group">
          <span className="font-mono text-[11px] font-black text-primary tracking-tight">
            {row.original.id.slice(0, 8)}...
          </span>
          <button
            onClick={() => handleCopyId(row.original.id)}
            className="opacity-60 group-hover:opacity-100 transition-opacity"
            title="Copiar ID completo"
          >
            {copiedId === row.original.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) => {
        const d = new Date(row.original.created_at);
        const fecha = d.toLocaleDateString();
        const hora = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[11px] font-black text-slate-700">{fecha}</span>
            <span className="text-[10px] font-mono text-slate-400">{hora}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${ESTADO_STYLE[row.original.estado]}`}>
          {ESTADO_LABEL[row.original.estado]}
        </span>
      ),
    },
    {
      accessorKey: "vendedor_nombre",
      header: "Vendedor",
      cell: ({ row }) => <span className="font-bold text-slate-700">{row.original.vendedor_nombre}</span>,
    },
    {
      accessorKey: "metodo_pago_nombre",
      header: "Pago",
      cell: ({ row }) => <span className="text-slate-600 text-xs font-bold uppercase">{row.original.metodo_pago_nombre}</span>,
    },
    {
      accessorKey: "total_general",
      header: () => <div className="text-center">Total</div>,
      cell: ({ row }) => <div className="text-center font-black text-emerald-700">Bs. {Number(row.original.total_general).toFixed(2)}</div>,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Historial de Ventas"
        icon={History}
        breadcrumbs={[{ label: "Sales" }, { label: "History_management" }]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={ventas}
          isFetching={isFetching}
          onRefresh={refetch}
          manualPagination
          pageCount={totalPages}
          pageIndex={page}
          onPageChange={(newIndex) => setPage(newIndex)}
          totalRecords={totalCount}
          globalFilter={searchValue}
          onGlobalFilterChange={setSearchValue}
          onSearchTrigger={handleSearchTrigger}
          sorting={sorting}
          onSortingChange={setSorting}
          onDetail={(venta) => {
            setVentaToDetail(venta);
            setIsDetailOpen(true);
          }}
          onEdit={(venta) => {
            setVentaToEdit(venta);
            setIsEditOpen(true);
          }}
          onDelete={(venta) => {
            setVentaToDelete(venta);
            setIsDeleteOpen(true);
          }}
        />
      </div>

      <VentaDetailModal
        ventaId={ventaToDetail?.id}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setVentaToDetail(null);
        }}
      />

      <VentaEditModal
        venta={ventaToEdit}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setVentaToEdit(null);
        }}
      />

      <GenericDeleteModal
        item={ventaToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setVentaToDelete(null);
        }}
        onDelete={(params) => deleteVenta(params).unwrap()}
        itemName={ventaToDelete?.id?.slice(0, 8) || ""}
        itemType="esta venta"
        itemIdentifier="Gestión de Ventas"
        isSuperUser
      />
    </div>
  );
};
