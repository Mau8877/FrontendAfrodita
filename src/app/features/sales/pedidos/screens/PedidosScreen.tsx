import { type ColumnDef, type SortingState } from "@tanstack/react-table";
import { CheckCircle, PackageSearch, Trash2 } from "lucide-react";
import { useState } from "react";

import { GenericDeleteModal } from "@/components/GenericDeleteModal";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { PedidoDetailModal, PedidoEditModal } from "../components";
import { useDeletePedidoMutation, useGetPedidosQuery } from "../store";
import type { Pedido } from "../types";

const ESTADO_LABELS: Record<Pedido["estado"], string> = {
  PENDIENTE: "Pendiente",
  COMPLETADO: "Completado",
  EN_CAMINO: "En Camino",
  CANCELADO: "Cancelado",
};

const ESTADO_BADGE_STYLES: Record<Pedido["estado"], string> = {
  PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200",
  COMPLETADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  EN_CAMINO: "bg-orange-100 text-orange-700 border-orange-200",
  CANCELADO: "bg-rose-100 text-rose-700 border-rose-200",
};

export const PedidosScreen = () => {
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [pedidoToEdit, setPedidoToEdit] = useState<Pedido | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pedidoToDetail, setPedidoToDetail] = useState<Pedido | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<Pedido | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deletePedido] = useDeletePedidoMutation();

  const ordering = sorting.length ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}` : undefined;
  const { data: apiResponse, isFetching, refetch } = useGetPedidosQuery({
    page: page + 1,
    ordering,
    search: appliedSearch || undefined,
  });

  const handleSearchTrigger = () => {
    setPage(0);
    setAppliedSearch(searchValue);
  };

  const pedidos = apiResponse?.data?.results || [];
  const totalCount = apiResponse?.data?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  const columns: ColumnDef<Pedido>[] = [
    {
      accessorKey: "codigo",
      header: "Código",
      enableSorting: true,
      cell: ({ row }) => <span className="font-black text-primary uppercase tracking-widest">{row.original.codigo}</span>,
    },
    {
      accessorKey: "cliente_nombre",
      header: "Cliente",
      cell: ({ row }) => <span className="font-bold text-slate-700">{row.original.cliente_nombre || "Cliente Invitado"}</span>,
    },
    {
      accessorKey: "total_general",
      header: "Total",
      enableSorting: true,
      cell: ({ row }) => <span className="font-black text-emerald-700">Bs. {Number(row.original.total_general || 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${ESTADO_BADGE_STYLES[row.original.estado]}`}
        >
          {ESTADO_LABELS[row.original.estado]}
        </span>
      ),
    },
    {
      id: "activo",
      header: "Registro",
      cell: ({ row }) =>
        row.original.deleted_at ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
            <Trash2 className="w-3 h-3" />
            En Papelera
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Gestionar Pedidos"
        icon={PackageSearch}
        breadcrumbs={[{ label: "Sales" }, { label: "Orders_management" }]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={pedidos}
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
          onEdit={(pedido) => {
            setPedidoToEdit(pedido);
            setIsEditOpen(true);
          }}
          onDetail={(pedido) => {
            setPedidoToDetail(pedido);
            setIsDetailOpen(true);
          }}
          onDelete={(pedido) => {
            setPedidoToDelete(pedido);
            setIsDeleteOpen(true);
          }}
        />
      </div>

      <PedidoEditModal
        pedido={pedidoToEdit}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setPedidoToEdit(null);
        }}
      />

      <PedidoDetailModal
        pedidoId={pedidoToDetail?.id}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setPedidoToDetail(null);
        }}
      />

      <GenericDeleteModal
        item={pedidoToDelete}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setPedidoToDelete(null);
        }}
        onDelete={(params) => deletePedido(params).unwrap()}
        itemName={pedidoToDelete?.codigo || ""}
        itemType="este pedido"
        itemIdentifier="Gestión de Ventas"
        isSuperUser
      />
    </div>
  );
};
