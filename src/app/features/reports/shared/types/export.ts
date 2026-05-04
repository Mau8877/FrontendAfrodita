export interface ExportColumn {
  key: string;
  label: string;
}

export interface ExportPayload {
  title: string;
  fileName: string;
  columns: ExportColumn[];
  rows: Record<string, string | number | null | undefined>[];
}

export interface ExportPayloadWithFilters extends ExportPayload {
  filters: Record<string, string | number | null | undefined>;
}
