/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductColor {
  id: string;
  nombre: string;
  codigo_hex: string;
}

export interface ProductImage {
  id: string;
  imagen: string; 
  es_principal: boolean;
}

export interface ProductTono {
  id: string;
  nombre: string;
}

export interface Product {
  id: string;
  id_tipo: string;
  id_marca: string;
  id_categoria: string;
  nombre: string;
  sku: string;
  descripcion: string | null;
  precio_venta: string; 
  stock_minimo: number;
  is_visible: boolean;
  
  nombre_marca: string;
  nombre_categoria: string;
  nombre_tipo: string;
  
  colores: ProductColor[];
  tonos: ProductTono[];
  imagenes: ProductImage[];
  
  stock_total?: number;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductSuggestion {
  id: string;
  nombre: string;
  sku: string;
  imagen_url: string | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  };
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}