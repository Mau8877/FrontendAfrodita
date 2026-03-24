/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/app/store/api/api'
import { 
  type Product, 
  type ProductSuggestion, 
  type PaginatedResponse, 
  type CatalogFilters,
  type StandardResponse,
  type CatalogSelectorsResponse,
} from '../types'

export const catalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- LISTADO DE CATÁLOGO ---
    getCatalog: builder.query<PaginatedResponse<Product>, CatalogFilters>({
      query: (params) => ({
        url: '/inventario/products/catalog/',
        method: 'GET',
        params: {
          page: params.page || 1,
          search: params.search,
          marca: params.marca,
          tonos: params.tonos,
          categoria: params.categoria,
          tipo: params.tipo,
        },
      }),

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Sacamos la página para que todas las páginas compartan la misma llave de caché
        const filters = { ...queryArgs };
        delete filters.page; 
        return `${endpointName}-${JSON.stringify(filters)}`;
      },

      merge: (currentCache, newItems, { arg }) => {
        // LA MAGIA ESTÁ ACÁ: Si pedimos la pág 1, borramos lo viejo y ponemos lo nuevo.
        // Esto mata cualquier basura que haya quedado del refresh.
        if (!currentCache || arg.page === 1) {
          return newItems;
        }

        const existingIds = new Set(currentCache.data.results.map(p => p.id));
        const uniqueNewResults = newItems.data.results.filter(p => !existingIds.has(p.id));

        return {
          ...newItems,
          data: {
            ...newItems.data,
            results: [...currentCache.data.results, ...uniqueNewResults],
            count: newItems.data.count,
            next: newItems.data.next
          }
        };
      },

      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },

      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'CATALOG_LIST' },
            ]
          : [{ type: 'Products', id: 'CATALOG_LIST' }],
    }),

    getProductCatalogDetail: builder.query<StandardResponse<Product>, string>({
      query: (id) => ({
        url: `/inventario/products/catalog/${id}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),

    // --- PRODUCTOS RELACIONADOS ---
    getRelatedProducts: builder.query<StandardResponse<Product[]>, string>({
      query: (productId) => ({
        url: `/inventario/products/catalog/${productId}/related/`,
        method: 'GET',
      }),
      providesTags: (result) => 
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'RELATED_LIST' },
            ]
          : [{ type: 'Products', id: 'RELATED_LIST' }],
    }),

    // --- SUGERENCIAS PARA AUTOCOMPLETE ---
    getSearchSuggestions: builder.query<StandardResponse<ProductSuggestion[]>, string>({
      query: (term) => ({
        url: '/inventario/products/catalog/suggestion/',
        method: 'GET',
        params: { q: term },
      }),
      providesTags: [{ type: 'Products', id: 'SUGGESTIONS' }],
    }),

    // --- SELECTORES PARA EL SIDEBAR ---
    getSelectors: builder.query<CatalogSelectorsResponse, void>({
      query: () => ({
        url: '/inventario/products/catalog/selectors/',
        method: 'GET',
      }),
      providesTags: [{ type: 'Products', id: 'SELECTORS' }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetCatalogQuery,
  useGetProductCatalogDetailQuery,
  useGetRelatedProductsQuery,
  useGetSearchSuggestionsQuery,
  useGetSelectorsQuery
} = catalogApi