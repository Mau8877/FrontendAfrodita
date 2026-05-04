import { Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLazyGetStockCriticoQuery } from "../../shared/store";
import { exportReportToExcel, exportReportToHtml, exportReportToPdf } from "../../shared/utils";

export const ReporteStockCriticoScreen = () => {
  const [trigger, { data = [], isFetching, isError }] = useLazyGetStockCriticoQuery();

  const columns = [
    { key: "producto", label: "Producto" },
    { key: "stock_actual", label: "Stock Actual" },
    { key: "stock_minimo", label: "Stock Mínimo" },
    { key: "estado", label: "Estado" },
  ];
  const rows = data.map((item) => ({ ...item }));

  return (
    <Card>
      <CardHeader><CardTitle>Reporte Stock Crítico</CardTitle><CardDescription>Productos con stock igual o por debajo del mínimo.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => trigger()}><RefreshCw className="mr-2 h-4 w-4" />Actualizar reporte</Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReportToPdf({ title: "Reporte Stock Crítico", fileName: "reporte-stock-critico", filters: {}, columns, rows })}><FileText className="mr-2 h-4 w-4" />Exportar PDF</Button>
          <Button variant="outline" onClick={() => exportReportToExcel({ title: "Stock Crítico", fileName: "reporte-stock-critico", columns, rows })}><FileSpreadsheet className="mr-2 h-4 w-4" />Exportar Excel</Button>
          <Button variant="outline" onClick={() => exportReportToHtml({ title: "Reporte Stock Crítico", fileName: "reporte-stock-critico", filters: {}, columns, rows })}><Download className="mr-2 h-4 w-4" />Exportar HTML</Button>
        </div>

        {isFetching && <p className="text-sm text-slate-500">Cargando reporte...</p>}
        {isError && <p className="text-sm text-rose-600">No se pudo cargar el reporte.</p>}
        {!isFetching && data.length === 0 && <p className="text-sm text-slate-500">Sin datos</p>}

        {data.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Stock Actual</TableHead><TableHead>Stock Mínimo</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
            <TableBody>{data.map((item) => <TableRow key={item.producto_id}><TableCell>{item.producto}</TableCell><TableCell>{item.stock_actual}</TableCell><TableCell>{item.stock_minimo}</TableCell><TableCell>{item.estado}</TableCell></TableRow>)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
