import type { StandardResponse, PaginatedData } from '@/app/common.types';
import type { PaymentMethodFormValues } from "./schemas";

export interface PaymentMethod {
  id: string;
  nombre: string;
  tipo: 'DIRECTO' | 'ONLINE';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreatePaymentMethodRequest = PaymentMethodFormValues;

export type UpdatePaymentMethodRequest = {
  id: string;
  body: Partial<PaymentMethodFormValues> | { restore: boolean };
};

export type PaymentMethodsListResponse = StandardResponse<PaginatedData<PaymentMethod>>;
export type PaymentMethodSimpleResponse = StandardResponse<Pick<PaymentMethod, 'id' | 'nombre'>[]>;
export type PaymentMethodResponse = StandardResponse<PaymentMethod>;