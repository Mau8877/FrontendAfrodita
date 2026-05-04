import { AlertTriangle, Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { useLazyGetComprasProveedorQuery } from "../../shared/store";
import { exportReportToExcel, exportReportToHtml, exportReportToPdf, formatBs, getCurrentMonthRange, isValidDateRange } from "../../shared/utils";

export const ReporteComprasProveedorScreen = () => {
  const range = getCurrentMonthRange();
  const [desde, setDesde] = useState(range.desde);
  const [hasta, setHasta] = useState(range.hasta);
  const [trigger, { data = [], isFetching, isError }] = useLazyGetComprasProveedorQuery();

  const handleGenerate = async () => {
    if (!isValidDateRange(desde, hasta)) return toast.error("La fecha 'desde' no puede ser mayor que 'hasta'.");
    await trigger({ desde, hasta });
  };

  const columns = [
    { key: "proveedor", label: "Proveedor" },
    { key: "cantidad_compras", label: "Compras" },
    { key: "unidades_compradas", label: "Unidades" },
    { key: "monto_comprado", label: "Monto Comprado" },
  ];

  const rows = data.map((item) => ({
    proveedor: item.proveedor,
    cantidad_compras: item.cantidad_compras,
    unidades_compradas: item.unidades_compradas,
    monto_comprado: formatBs(item.monto_comprado),
  }));

  return (
    <Card>
      <CardHeader><CardTitle>Reporte Compras por Proveedor</CardTitle><CardDescription>Resumen de compras agrupado por proveedor.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div><Label>Desde</Label><Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></div>
          <div><Label>Hasta</Label><Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></div>
          <div className="flex items-end"><Button onClick={handleGenerate} className="w-full"><RefreshCw className="mr-2 h-4 w-4" />Generar reporte</Button></div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReportToPdf({ title: "Reporte Compras por Proveedor", fileName: "reporte-compras-proveedor", filters: { desde, hasta }, columns, rows })}><FileText className="mr-2 h-4 w-4" />Exportar PDF</Button>
          <Button variant="outline" onClick={() => exportReportToExcel({ title: "Compras por Proveedor", fileName: "reporte-compras-proveedor", columns, rows })}><FileSpreadsheet className="mr-2 h-4 w-4" />Exportar Excel</Button>
          <Button variant="outline" onClick={() => exportReportToHtml({ title: "Reporte Compras por Proveedor", fileName: "reporte-compras-proveedor", filters: { desde, hasta }, columns, rows })}><Download className="mr-2 h-4 w-4" />Exportar HTML</Button>
        </div>

        {isFetching && <p className="text-sm text-slate-500">Cargando reporte...</p>}
        {isError && <p className="text-sm text-rose-600">No se pudo cargar el reporte.</p>}
        {!isFetching && data.length === 0 && <p className="text-sm text-slate-500 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Sin datos</p>}

        {data.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Proveedor</TableHead><TableHead>Compras</TableHead><TableHead>Unidades</TableHead><TableHead>Monto</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.proveedor_id}><TableCell>{item.proveedor}</TableCell><TableCell>{item.cantidad_compras}</TableCell><TableCell>{item.unidades_compradas}</TableCell><TableCell>{formatBs(item.monto_comprado)}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
