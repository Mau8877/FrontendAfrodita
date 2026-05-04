import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  helperText: string;
  tone?: "sky" | "emerald" | "amber" | "rose";
}

const toneClassMap: Record<NonNullable<DashboardMetricCardProps["tone"]>, string> = {
  sky: "bg-sky-100 text-sky-700 border-sky-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
};

export function DashboardMetricCard({ title, value, icon: Icon, helperText, tone = "sky" }: DashboardMetricCardProps) {
  return (
    <Card className="group rounded-2xl border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</CardTitle>
        </div>
        <div className={`rounded-xl border p-2.5 transition-transform duration-300 group-hover:scale-105 ${toneClassMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tight text-slate-900">{value}</div>
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      </CardContent>
    </Card>
  );
}
