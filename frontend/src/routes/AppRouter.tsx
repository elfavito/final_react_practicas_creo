import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth
import { LoginPage } from '../features/auth/pages/LoginPage/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage/RegisterPage';

// Products
import { ProductsPage } from '../features/products/pages/ProductsPage/ProductsPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage/ProductDetailPage';

// Cart & Checkout
import { CartPage } from '../features/cart/pages/CartPage/CartPage';
import { CheckoutPage } from '../features/cart/pages/CheckoutPage/CheckoutPage';

// Guards
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Protected routes — require authentication */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
};
