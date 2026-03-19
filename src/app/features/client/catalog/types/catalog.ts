export interface CatalogFilters {
  page?: number;
  search?: string;
  marca?: string;
  tonos?: string;    
  categoria?: string;
  tipo?: string;
}

/** * Tip adicional: Interfaz para la respuesta de los selectores 
 * que alimentan el Sidebar del catálogo.
 */
export interface CatalogSelectorsResponse {
  success: boolean;
  message: string;
  data: {
    marcas: { id: string; nombre: string }[];
    categorias: { id: string; nombre: string }[];
    tipos: { id: string; nombre: string }[];
    tonos: { id: string; nombre: string }[];
  };
}