import { api } from "@/app/store/api/api";
import type {
  PaymentMethodResponse,
  PaymentMethodsListResponse,
  PaymentMethodSimpleResponse,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
} from "../types";

export const paymentMethodsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // --- LISTADO PAGINADO (ADMIN) ---
    getPaymentMethods: builder.query<
      PaymentMethodsListResponse,
      { page?: number; search?: string; ordering?: string }
    >({
      query: (params) => ({
        url: "/sales/payment-method/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({
                type: "PaymentMethods" as const,
                id,
              })),
              { type: "PaymentMethods", id: "LIST" },
            ]
          : [{ type: "PaymentMethods", id: "LIST" }],
    }),

    // --- LISTA SIMPLE (SELECTORES CARRITO) ---
    getPaymentMethodsSimple: builder.query<PaymentMethodSimpleResponse, void>({
      query: () => "/sales/payment-methods/simple-list/",
      providesTags: [{ type: "PaymentMethods", id: "LIST" }],
    }),

    // --- DETALLE ---
    getPaymentMethodById: builder.query<PaymentMethodResponse, string>({
      query: (id) => `/sales/payment-method/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "PaymentMethods", id }],
    }),

    // --- CREAR ---
    createPaymentMethod: builder.mutation<
      PaymentMethodResponse,
      CreatePaymentMethodRequest
    >({
      query: (newMethod) => ({
        url: "/sales/payment-method/",
        method: "POST",
        body: newMethod,
      }),
      invalidatesTags: [
        { type: "PaymentMethods", id: "LIST" },
        { type: "ActionLogs", id: "LIST" },
        "LoginLogs",
      ],
    }),

    // --- ACTUALIZAR / RESTAURAR ---
    updatePaymentMethod: builder.mutation<
      PaymentMethodResponse,
      UpdatePaymentMethodRequest
    >({
      query: ({ id, body }) => ({
        url: `/sales/payment-method/${id}/`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PaymentMethods", id },
        { type: "PaymentMethods", id: "LIST" },
        { type: "ActionLogs", id: "LIST" },
        "LoginLogs",
      ],
    }),

    // --- ELIMINAR ---
    deletePaymentMethod: builder.mutation<
      { success: boolean; message: string },
      { id: string; permanent?: boolean }
    >({
      query: ({ id, permanent = false }) => ({
        url: `/sales/payment-method/${id}/`,
        method: "DELETE",
        params: { permanent },
      }),
      invalidatesTags: [
        { type: "PaymentMethods", id: "LIST" },
        { type: "ActionLogs", id: "LIST" },
        "LoginLogs",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentMethodsQuery,
  useGetPaymentMethodsSimpleQuery,
  useGetPaymentMethodByIdQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodsApi;
