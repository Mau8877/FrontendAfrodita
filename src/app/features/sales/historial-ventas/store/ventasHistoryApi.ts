import { api } from "@/app/store/api/api";
import type {
  UpdateVentaRequest,
  VentaDetailResponse,
  VentasListResponse,
} from "../types";

export const ventasHistoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVentasHistory: builder.query<VentasListResponse, { page?: number; search?: string; ordering?: string }>({
      query: (params) => ({
        url: "/sales/ventas/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: "Ventas" as const, id })),
              { type: "Ventas", id: "LIST" },
            ]
          : [{ type: "Ventas", id: "LIST" }],
    }),

    getVentaById: builder.query<VentaDetailResponse, string>({
      query: (id) => `/sales/ventas/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Ventas", id }],
    }),

    updateVenta: builder.mutation<VentaDetailResponse, UpdateVentaRequest>({
      query: ({ id, body }) => ({
        url: `/sales/ventas/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ventas", id },
        { type: "Ventas", id: "LIST" },
      ],
    }),

    deleteVenta: builder.mutation<{ success: boolean; mensaje: string }, { id: string; permanent?: boolean }>({
      query: ({ id, permanent = false }) => ({
        url: `/sales/ventas/${id}/`,
        method: "DELETE",
        params: { permanent },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ventas", id },
        { type: "Ventas", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVentasHistoryQuery,
  useGetVentaByIdQuery,
  useUpdateVentaMutation,
  useDeleteVentaMutation,
} = ventasHistoryApi;
