import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { CartWidget } from './features/cart/components/CartWidget/CartWidget';
import { useAppSelector, useAppDispatch } from './store/store';
import { logout } from './features/auth/slice/authSlice';
import { UserRole } from './types';
import { Package } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline text-slate-900 dark:text-white transition-opacity hover:opacity-90">
          <span className="text-2xl">🎓</span>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 leading-none">
              EduCart
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">
              Academic Marketplace
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:inline-block"
          >
            Inicio
          </Link>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Catálogo
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-orders"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Package size={16} />
              <span className="hidden sm:inline">Mis Pedidos</span>
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/admin/inventory"
                className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800"
              >
                📦 Inventario
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario'}
              </span>
              <button
                className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                onClick={() => dispatch(logout())}
                title="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
              >
                Registro
              </Link>
            </div>
          )}

          <CartWidget />
        </nav>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
              EduCart
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Plataforma Full-Stack de comercio electrónico educativo — Desafío Final 2025. Arquitectura en Capas y Screaming Architecture.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Inicio</Link>
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Catálogo</Link>
          <Link to="/products?categoria=Study%20Materials" className="hover:text-indigo-600 transition-colors">Study Materials</Link>
          <Link to="/products?categoria=Tech%20Tools" className="hover:text-indigo-600 transition-colors">Tech Tools</Link>
          <Link to="/products?categoria=Robotics%20%26%20Hardware" className="hover:text-indigo-600 transition-colors">Robotics</Link>
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
          © {new Date().getFullYear()} EduCart. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
