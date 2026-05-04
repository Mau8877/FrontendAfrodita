import { Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { useLazyGetVentasSucursalQuery } from "../../shared/store";
import { exportReportToExcel, exportReportToHtml, exportReportToPdf, formatBs, getCurrentMonthRange, isValidDateRange } from "../../shared/utils";

export const ReporteVentaPorSucursalScreen = () => {
  const range = getCurrentMonthRange();
  const [desde, setDesde] = useState(range.desde);
  const [hasta, setHasta] = useState(range.hasta);
  const [trigger, { data = [], isFetching, isError }] = useLazyGetVentasSucursalQuery();

  const handleGenerate = async () => {
    if (!isValidDateRange(desde, hasta)) return toast.error("La fecha 'desde' no puede ser mayor que 'hasta'.");
    await trigger({ desde, hasta });
  };

  const columns = [
    { key: "sucursal", label: "Sucursal" },
    { key: "cantidad_ventas", label: "Ventas" },
    { key: "total_vendido", label: "Total" },
    { key: "ticket_promedio", label: "Ticket Promedio" },
  ];
  const rows = data.map((item) => ({
    sucursal: item.sucursal,
    cantidad_ventas: item.cantidad_ventas,
    total_vendido: formatBs(item.total_vendido),
    ticket_promedio: formatBs(item.ticket_promedio),
  }));

  return (
    <Card>
      <CardHeader><CardTitle>Reporte Ventas por Sucursal</CardTitle><CardDescription>Comparativo de ventas agrupado por sucursal.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div><Label>Desde</Label><Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></div>
          <div><Label>Hasta</Label><Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></div>
          <div className="flex items-end"><Button onClick={handleGenerate} className="w-full"><RefreshCw className="mr-2 h-4 w-4" />Generar reporte</Button></div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReportToPdf({ title: "Reporte Ventas por Sucursal", fileName: "reporte-venta-por-sucursal", filters: { desde, hasta }, columns, rows })}><FileText className="mr-2 h-4 w-4" />Exportar PDF</Button>
          <Button variant="outline" onClick={() => exportReportToExcel({ title: "Ventas por Sucursal", fileName: "reporte-venta-por-sucursal", columns, rows })}><FileSpreadsheet className="mr-2 h-4 w-4" />Exportar Excel</Button>
          <Button variant="outline" onClick={() => exportReportToHtml({ title: "Reporte Ventas por Sucursal", fileName: "reporte-venta-por-sucursal", filters: { desde, hasta }, columns, rows })}><Download className="mr-2 h-4 w-4" />Exportar HTML</Button>
        </div>

        {isFetching && <p className="text-sm text-slate-500">Cargando reporte...</p>}
        {isError && <p className="text-sm text-rose-600">No se pudo cargar el reporte.</p>}
        {!isFetching && data.length === 0 && <p className="text-sm text-slate-500">Sin datos</p>}

        {data.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Sucursal</TableHead><TableHead>Ventas</TableHead><TableHead>Total</TableHead><TableHead>Ticket Promedio</TableHead></TableRow></TableHeader>
            <TableBody>{data.map((item, idx) => <TableRow key={`${item.sucursal_id ?? "no-sucursal"}-${idx}`}><TableCell>{item.sucursal}</TableCell><TableCell>{item.cantidad_ventas}</TableCell><TableCell>{formatBs(item.total_vendido)}</TableCell><TableCell>{formatBs(item.ticket_promedio)}</TableCell></TableRow>)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
