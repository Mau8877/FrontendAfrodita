import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseApi } from './createBaseApi'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: createBaseApi({
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 60000,
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    authTokenPath: 'token',
    apiName: 'AfroditaAPI',
    debug: true,
  }),
  // Definimos los tags globales, pero no los endpoints
  tagTypes: [
    // TAGS DE ADMINISTRACION
    'Users', 'Auth', 'Menu', 'Roles', 'LoginLogs', 'ActionLogs',
    'Brands', 'Categories', 'ProductTypes', 'Colors', 'Tonos',
    'Products', 'Suppliers', 'Replenishment', 'Stock', 'PaymentMethods',
    'Branches', 'ShippingRates',
    
    // TAGS DE CLIENTES
    
  ], 
  endpoints: () => ({}),
})