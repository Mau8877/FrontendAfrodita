import { api } from '@/app/store/api/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  DeliveryState, 
  DeliveryRateRequest, 
  DeliveryRateResponse,
  DeliveryMethod
} from '../types'

// ============================================================================
// RTK QUERY
// ============================================================================
export const deliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    calculateDeliveryRate: builder.mutation<{ success: boolean; data: DeliveryRateResponse; message?: string }, DeliveryRateRequest>({
      query: (body) => ({
        url: '/logistic/delivery/calculate-rate/', 
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useCalculateDeliveryRateMutation,
} = deliveryApi

// ============================================================================
// ZUSTAND
// ============================================================================
export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      method: 'pickup',
      coordinates: null,
      addressReference: '',
      rateData: null,

      setMethod: (method: DeliveryMethod) => {
        set({ method })
        if (method === 'pickup') {
          set({ rateData: null })
        }
      },
      
      setCoordinates: (lat: number, lng: number) => set({ coordinates: { lat, lng } }),
      setAddressReference: (ref: string) => set({ addressReference: ref }),
      setRateData: (data: DeliveryRateResponse | null) => set({ rateData: data }),

      resetDelivery: () => set({ 
        method: 'pickup', 
        coordinates: null, 
        addressReference: '', 
        rateData: null 
      }),
    }),
    { 
      name: 'afrodita-delivery-storage',
      partialize: (state) => ({ 
        method: state.method, 
        addressReference: state.addressReference 
      })
    }
  )
)