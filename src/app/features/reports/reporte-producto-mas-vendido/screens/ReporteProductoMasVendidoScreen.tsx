import { Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { useLazyGetProductosMasVendidosQuery } from "../../shared/store";
import { exportReportToExcel, exportReportToHtml, exportReportToPdf, formatBs, getCurrentMonthRange, isValidDateRange } from "../../shared/utils";

export const ReporteProductoMasVendidoScreen = () => {
  const range = getCurrentMonthRange();
  const [desde, setDesde] = useState(range.desde);
  const [hasta, setHasta] = useState(range.hasta);
  const [limite, setLimite] = useState(10);
  const [trigger, { data = [], isFetching, isError }] = useLazyGetProductosMasVendidosQuery();

  const handleGenerate = async () => {
    if (!isValidDateRange(desde, hasta)) return toast.error("La fecha 'desde' no puede ser mayor que 'hasta'.");
    await trigger({ desde, hasta, limite });
  };

  const columns = [
    { key: "producto", label: "Producto" },
    { key: "categoria", label: "Categoría" },
    { key: "marca", label: "Marca" },
    { key: "unidades_vendidas", label: "Unidades" },
    { key: "ingreso_generado", label: "Ingreso" },
  ];
  const rows = data.map((item) => ({
    producto: item.producto,
    categoria: item.categoria || "-",
    marca: item.marca || "-",
    unidades_vendidas: item.unidades_vendidas,
    ingreso_generado: formatBs(item.ingreso_generado),
  }));

  return (
    <Card>
      <CardHeader><CardTitle>Reporte Productos Más Vendidos</CardTitle><CardDescription>Top de productos por unidades vendidas e ingreso generado.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div><Label>Desde</Label><Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></div>
          <div><Label>Hasta</Label><Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></div>
          <div><Label>Límite</Label><Input type="number" min={1} value={limite} onChange={(e) => setLimite(Number(e.target.value || 10))} /></div>
          <div className="flex items-end"><Button onClick={handleGenerate} className="w-full"><RefreshCw className="mr-2 h-4 w-4" />Generar reporte</Button></div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReportToPdf({ title: "Reporte Productos Más Vendidos", fileName: "reporte-producto-mas-vendido", filters: { desde, hasta, limite }, columns, rows })}><FileText className="mr-2 h-4 w-4" />Exportar PDF</Button>
          <Button variant="outline" onClick={() => exportReportToExcel({ title: "Productos Más Vendidos", fileName: "reporte-producto-mas-vendido", columns, rows })}><FileSpreadsheet className="mr-2 h-4 w-4" />Exportar Excel</Button>
          <Button variant="outline" onClick={() => exportReportToHtml({ title: "Reporte Productos Más Vendidos", fileName: "reporte-producto-mas-vendido", filters: { desde, hasta, limite }, columns, rows })}><Download className="mr-2 h-4 w-4" />Exportar HTML</Button>
        </div>

        {isFetching && <p className="text-sm text-slate-500">Cargando reporte...</p>}
        {isError && <p className="text-sm text-rose-600">No se pudo cargar el reporte.</p>}
        {!isFetching && data.length === 0 && <p className="text-sm text-slate-500">Sin datos</p>}

        {data.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Categoría</TableHead><TableHead>Marca</TableHead><TableHead>Unidades</TableHead><TableHead>Ingreso</TableHead></TableRow></TableHeader>
            <TableBody>{data.map((item) => <TableRow key={item.producto_id}><TableCell>{item.producto}</TableCell><TableCell>{item.categoria || "-"}</TableCell><TableCell>{item.marca || "-"}</TableCell><TableCell>{item.unidades_vendidas}</TableCell><TableCell>{formatBs(item.ingreso_generado)}</TableCell></TableRow>)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
