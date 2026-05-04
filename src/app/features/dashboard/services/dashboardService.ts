import { api } from "@/app/store/api/api";
import type { DashboardKpisResponse } from "../types";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardKpis: builder.query<DashboardKpisResponse, void>({
      query: () => ({
        url: "/reportes/dashboard-kpis/",
        method: "GET",
      }),
      providesTags: [{ type: "Ventas", id: "DASHBOARD_KPIS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardKpisQuery } = dashboardApi;
