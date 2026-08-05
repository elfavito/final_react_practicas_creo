import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage/RegisterPage';
import { ProductsPage } from './features/products/pages/ProductsPage/ProductsPage';
import { ProductDetailPage } from './features/products/pages/ProductDetailPage/ProductDetailPage';

export const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Modern Store</h1>
          <nav>
            <a href="/products">Catálogo</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
