import { endOfMonth, format, startOfMonth } from "date-fns";

export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    desde: format(startOfMonth(now), "yyyy-MM-dd"),
    hasta: format(endOfMonth(now), "yyyy-MM-dd"),
  };
};

export const isValidDateRange = (desde: string, hasta: string) => {
  if (!desde || !hasta) return false;
  return new Date(desde) <= new Date(hasta);
};

export const formatBs = (value: number) => `Bs. ${Number(value || 0).toFixed(2)}`;
