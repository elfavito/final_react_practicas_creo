import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { getProductImage } from '../../utils/imageUtils';
import { useProduct } from '../../hooks/useProducts';
import { useAppDispatch } from '../../../../store/store';
import { addToCart } from '../../../cart/slice/cartSlice';
import { Button } from '../../../../components/ui/Button/Button';
import { StockBadge } from '../../components/StockBadge/StockBadge';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError } = useProduct(Number(id));

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 min-h-[50vh] flex items-center justify-center text-lg text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Cargando producto...</span>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Producto no encontrado</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">El producto solicitado no existe o fue retirado del catálogo.</p>
          <Button onClick={() => navigate('/products')}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  const handleIncrement = () => {
    if (quantity < product.stock_actual) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleOptionSelect = (key: string, val: string) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: val }));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, cantidad: quantity }));
  };

  const isOutOfStock = product.stock_actual === 0;
  const opciones = product.opciones || {};
  const hasOptions = Object.keys(opciones).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-8 no-underline"
      >
        <ArrowLeft size={18} />
        Volver al catálogo
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Visualización de Imagen */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
          <img
            src={getProductImage(product.id)}
            alt={product.nombre}
            className="w-full max-w-md object-contain aspect-square hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Información del Producto */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                {product.categoria}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              {product.nombre}
            </h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full font-bold text-sm">
                <Star size={18} fill="currentColor" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <StockBadge stock={product.stock_actual} />
            </div>

            <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              ${product.precio.toFixed(2)}
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {product.descripcion || 'Sin descripción disponible.'}
            </p>

            {/* Selectores de opciones dinámicas (color, talla, capacidad) - US-SHOP-05 */}
            {hasOptions && (
              <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Opciones disponibles
                </h4>
                {Object.entries(opciones).map(([optKey, optValues]) => {
                  const values = Array.isArray(optValues) ? optValues : [String(optValues)];
                  const currentSelected = selectedOptions[optKey] || values[0];

                  return (
                    <div key={optKey} className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                        {optKey}: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentSelected}</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {values.map((val: string) => {
                          const isSelected = currentSelected === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleOptionSelect(optKey, val)}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                              }`}
                            >
                              {isSelected && <Check size={13} />}
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panel de Compra */}
          <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Cantidad a comprar:
              </span>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 flex items-center justify-center border border-slate-300 dark:border-slate-600 rounded-l-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 h-10 flex items-center justify-center border-t border-b border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white text-base">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  className="w-10 h-10 flex items-center justify-center border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock_actual || isOutOfStock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="py-4 text-base font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingCart size={20} />
              {isOutOfStock ? 'Producto Agotado' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
