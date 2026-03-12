import type { ProductFormValues } from "./schemas";
import type { StandardResponse, PaginatedData } from '@/app/common.types';

// --- MODELO DE DATOS (DOMINIO / LECTURA) ---
export interface Product {
  id: string;
  id_tipo: string;
  id_marca: string;
  id_categoria: string;
  nombre: string;
  sku: string;
  descripcion: string;
  precio_venta: string; 
  stock_minimo: number;
  is_visible: boolean;
  nombre_marca?: string;
  nombre_categoria?: string;
  nombre_tipo?: string;
  colores: {
    id: string;
    nombre: string;
    codigo_hex: string;
  }[];
  // En lectura el backend devuelve 'imagenes'
  imagenes: {
    id: string;
    imagen: string;
    es_principal: boolean;
  }[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- TIPO PARA LISTADO SIMPLE REPOSICION DE STOCK ---
export interface ProductSimple {
  id: string;
  nombre: string;
}

// --- TIPOS PARA SELECTORES ---
export interface ProductSelectors {
  marcas: { id: string; nombre: string }[];
  categorias: { id: string; nombre: string }[];
  tipos: { id: string; nombre: string }[];
  colores: { id: string; nombre: string; codigo_hex: string }[];
}

// --- TIPOS PARA PETICIONES (ESCRITURA) ---
export type CreateProductRequest = ProductFormValues; 

export type UpdateProductRequest = {
  id: string;
  body: Partial<ProductFormValues & { restore?: boolean }>;
};

// Respuesta para la HomePage Nuevos Modelos (Lista de 3 productos sin paginación)
export type NewModelsResponse = StandardResponse<Product[]>;

export type ProductsListResponse = StandardResponse<PaginatedData<Product>>;
export type ProductResponse = StandardResponse<Product>;
export type ProductSelectorsResponse = StandardResponse<ProductSelectors>;
export type ProductSimpleListResponse = StandardResponse<ProductSimple[]>;