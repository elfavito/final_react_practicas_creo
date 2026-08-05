import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { CartWidget } from './features/cart/components/CartWidget/CartWidget';
import { useAppSelector, useAppDispatch } from './store/store';
import { logout } from './features/auth/slice/authSlice';
import { UserRole } from './types';
import './App.css';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/products" className="app-header__brand">
          <span className="app-header__logo">🛍️</span>
          <span className="app-header__name">ModernStore</span>
        </Link>

        <nav className="app-header__nav">
          <Link to="/products" className="app-header__link">Catálogo</Link>

          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/dashboard" className="app-header__link app-header__link--admin">
                📊 Dashboard
              </Link>
              <Link to="/admin/inventory" className="app-header__link app-header__link--admin">
                📦 Inventario
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <span className="app-header__user">Hola, {user?.full_name?.split(' ')[0] || 'Usuario'}</span>
              <button
                className="app-header__btn-ghost"
                onClick={() => dispatch(logout())}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="app-header__link">Iniciar sesión</Link>
              <Link to="/register" className="app-header__btn-primary">Registrarse</Link>
            </>
          )}

          <CartWidget />
        </nav>
      </div>
    </header>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="app-main">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
