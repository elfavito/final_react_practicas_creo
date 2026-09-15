import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Home / Landing
import { HomePage } from '../features/home/pages/HomePage/HomePage';

// Auth
import { LoginPage } from '../features/auth/pages/LoginPage/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage/RegisterPage';

// Products
import { ProductsPage } from '../features/products/pages/ProductsPage/ProductsPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage/ProductDetailPage';

// Cart & Checkout
import { CartPage } from '../features/cart/pages/CartPage/CartPage';
import { CheckoutPage } from '../features/cart/pages/CheckoutPage/CheckoutPage';

// Orders History
import { MyOrdersPage } from '../features/orders/pages/MyOrdersPage/MyOrdersPage';

// Admin — Dashboard & Inventory
import { DashboardPage } from '../features/dashboard/pages/DashboardPage/DashboardPage';
import { InventoryPage } from '../features/inventory/pages/InventoryPage/InventoryPage';

// Guards
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '../types';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      {/* US-SHOP-04 alias */}
      <Route path="/item/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Protected routes — require authentication (CLIENT or ADMIN) */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes — require ADMIN role */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole={UserRole.ADMIN}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute requiredRole={UserRole.ADMIN}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
