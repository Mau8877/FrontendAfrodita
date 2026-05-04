import { Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { useLazyGetVentasPeriodoQuery } from "../../shared/store";
import { exportReportToExcel, exportReportToHtml, exportReportToPdf, formatBs, getCurrentMonthRange, isValidDateRange } from "../../shared/utils";
import type { VentaPeriodoAgrupado } from "../../shared/types";

export const ReporteVentaPorPeriodoScreen = () => {
  const range = getCurrentMonthRange();
  const [desde, setDesde] = useState(range.desde);
  const [hasta, setHasta] = useState(range.hasta);
  const [agrupadoPor, setAgrupadoPor] = useState<VentaPeriodoAgrupado>("dia");
  const [trigger, { data, isFetching, isError }] = useLazyGetVentasPeriodoQuery();

  const handleGenerate = async () => {
    if (!isValidDateRange(desde, hasta)) return toast.error("La fecha 'desde' no puede ser mayor que 'hasta'.");
    await trigger({ desde, hasta, agrupado_por: agrupadoPor });
  };

  const series = data?.series || [];
  const columns = [
    { key: "periodo", label: "Período" },
    { key: "cantidad_ventas", label: "Ventas" },
    { key: "total_vendido", label: "Total" },
    { key: "ticket_promedio", label: "Ticket Promedio" },
  ];
  const rows = series.map((item) => ({
    periodo: item.periodo,
    cantidad_ventas: item.cantidad_ventas,
    total_vendido: formatBs(item.total_vendido),
    ticket_promedio: formatBs(item.ticket_promedio),
  }));

  return (
    <Card>
      <CardHeader><CardTitle>Reporte Ventas por Período</CardTitle><CardDescription>Evolución de ventas agrupada por día, semana o mes.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div><Label>Desde</Label><Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></div>
          <div><Label>Hasta</Label><Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></div>
          <div><Label>Agrupar por</Label><Select value={agrupadoPor} onValueChange={(v) => setAgrupadoPor(v as VentaPeriodoAgrupado)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dia">Día</SelectItem><SelectItem value="semana">Semana</SelectItem><SelectItem value="mes">Mes</SelectItem></SelectContent></Select></div>
          <div className="flex items-end"><Button onClick={handleGenerate} className="w-full"><RefreshCw className="mr-2 h-4 w-4" />Generar reporte</Button></div>
        </div>

        {data?.resumen && (
          <div className="grid gap-3 md:grid-cols-3">
            <Card><CardContent className="pt-6"><p className="text-xs text-slate-500">Total vendido</p><p className="text-lg font-bold">{formatBs(data.resumen.total_vendido)}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-xs text-slate-500">Cantidad ventas</p><p className="text-lg font-bold">{data.resumen.cantidad_ventas}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-xs text-slate-500">Ticket promedio</p><p className="text-lg font-bold">{formatBs(data.resumen.ticket_promedio)}</p></CardContent></Card>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReportToPdf({ title: "Reporte Ventas por Período", fileName: "reporte-venta-por-periodo", filters: { desde, hasta, agrupadoPor }, columns, rows })}><FileText className="mr-2 h-4 w-4" />Exportar PDF</Button>
          <Button variant="outline" onClick={() => exportReportToExcel({ title: "Ventas por Período", fileName: "reporte-venta-por-periodo", columns, rows })}><FileSpreadsheet className="mr-2 h-4 w-4" />Exportar Excel</Button>
          <Button variant="outline" onClick={() => exportReportToHtml({ title: "Reporte Ventas por Período", fileName: "reporte-venta-por-periodo", filters: { desde, hasta, agrupadoPor }, columns, rows })}><Download className="mr-2 h-4 w-4" />Exportar HTML</Button>
        </div>

        {isFetching && <p className="text-sm text-slate-500">Cargando reporte...</p>}
        {isError && <p className="text-sm text-rose-600">No se pudo cargar el reporte.</p>}
        {!isFetching && series.length === 0 && <p className="text-sm text-slate-500">Sin datos</p>}

        {series.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Período</TableHead><TableHead>Ventas</TableHead><TableHead>Total</TableHead><TableHead>Ticket Promedio</TableHead></TableRow></TableHeader>
            <TableBody>{series.map((item) => <TableRow key={item.periodo}><TableCell>{item.periodo}</TableCell><TableCell>{item.cantidad_ventas}</TableCell><TableCell>{formatBs(item.total_vendido)}</TableCell><TableCell>{formatBs(item.ticket_promedio)}</TableCell></TableRow>)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
