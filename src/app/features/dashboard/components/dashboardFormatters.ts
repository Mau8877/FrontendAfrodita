export const formatBs = (value: number) => `Bs. ${Number(value || 0).toFixed(2)}`;

export const formatDate = (raw: string) => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short" });
};

export const formatDateTime = (raw: string) => {
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
