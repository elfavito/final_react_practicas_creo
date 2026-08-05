// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  ENVIADO = 'ENVIADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export type StockStatus = 'Normal' | 'Alerta' | 'Agotado';

// User Interfaces
export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
  role?: UserRole;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

// Product Interfaces
export interface Product {
  id: number;
  sku: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria: string;
  rating: number;
  stock_actual: number;
  stock_minimo: number;
  opciones: Record<string, unknown>;
  status?: StockStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  sku: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  rating?: number;
  stock_actual: number;
  stock_minimo: number;
  opciones?: Record<string, unknown>;
}

export interface ProductUpdate {
  sku?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  rating?: number;
  stock_actual?: number;
  stock_minimo?: number;
  opciones?: Record<string, unknown>;
}

// Order Interfaces
export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  cantidad: number;
  precio_unitario: number;
  product?: Product;
}

export interface OrderItemCreate {
  product_id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  shipping_address?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderCreate {
  shipping_address?: string;
  items: OrderItemCreate[];
}

export interface OrderUpdate {
  status?: OrderStatus;
  shipping_address?: string;
}

// Cart Interfaces
export interface CartItem {
  product: Product;
  cantidad: number;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  size?: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface DashboardMetrics {
  total_sales: number;
  total_orders: number;
  total_products: number;
  low_stock_count: number;
  sales_by_category: Record<string, number>;
}
