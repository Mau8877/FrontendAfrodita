import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, string> = {
  COMPLETADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELADO: "bg-rose-100 text-rose-700 border-rose-200",
  EN_CAMINO: "bg-sky-100 text-sky-700 border-sky-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={`border font-bold uppercase tracking-wide ${STATUS_MAP[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
      {status}
    </Badge>
  );
}
