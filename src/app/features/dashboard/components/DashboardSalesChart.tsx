import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardVentaUltimos7DiasItem } from "../types";
import { DashboardSectionCard } from "./DashboardSectionCard";
import { formatBs, formatDate } from "./dashboardFormatters";

interface DashboardSalesChartProps {
  data: DashboardVentaUltimos7DiasItem[];
}

const formatYAxisMoney = (value: number) => {
  const n = Number(value || 0);
  if (n === 0) return "0";
  if (Math.abs(n) < 1000) return `${Math.round(n)}`;
  if (Math.abs(n) < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
};

export function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  const total7Dias = data.reduce((acc, item) => acc + Number(item.total_vendido || 0), 0);
  const bestDay = data.reduce<DashboardVentaUltimos7DiasItem | null>((best, current) => {
    if (!best) return current;
    return Number(current.total_vendido || 0) > Number(best.total_vendido || 0) ? current : best;
  }, null);

  return (
    <DashboardSectionCard
      title="Ventas últimos 7 días"
      description="Seguimiento diario de ingresos y volumen de operaciones."
      action={
        <div className="grid gap-1 text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total 7 días</span>
          <span className="text-sm font-black text-slate-900">{formatBs(total7Dias)}</span>
          <span className="text-[11px] text-slate-500">
            Pico: {bestDay ? `${formatDate(bestDay.fecha)} (${formatBs(bestDay.total_vendido)})` : "-"}
          </span>
        </div>
      }
    >
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 14, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis
              dataKey="fecha"
              tickFormatter={formatDate}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatYAxisMoney}
              allowDecimals={false}
              tickCount={5}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis yAxisId="right" orientation="right" hide />
            <Tooltip
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                fontSize: "12px",
              }}
              labelFormatter={(value) => `Fecha: ${formatDate(String(value))}`}
              formatter={(value, name) => {
                if (name === "total_vendido") return [formatBs(Number(value)), "Total vendido"];
                return [value, "Cantidad ventas"];
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="total_vendido"
              fill="url(#ventasGradient)"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#a855f7", stroke: "#fff", strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line yAxisId="right" type="monotone" dataKey="cantidad_ventas" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DashboardSectionCard>
  );
}
