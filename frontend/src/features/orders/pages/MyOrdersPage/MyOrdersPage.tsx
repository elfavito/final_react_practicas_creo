import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import axiosInstance from '../../../../lib/axiosInstance';
import { Button } from '../../../../components/ui/Button/Button';
import { getProductImage } from '../../../products/utils/imageUtils';
import type { Order } from '../../../../types';

const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get('/orders/my-orders');
  return response.data;
};

const formatDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'PAID':
    case 'PAGADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 size={14} />
          Pagado
        </span>
      );
    case 'SHIPPED':
    case 'ENVIADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          <Truck size={14} />
          Enviado
        </span>
      );
    case 'DELIVERED':
    case 'ENTREGADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          <CheckCircle2 size={14} />
          Entregado
        </span>
      );
    case 'CANCELLED':
    case 'CANCELADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          <XCircle size={14} />
          Cancelado
        </span>
      );
    case 'PENDING':
    case 'PENDIENTE':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <Clock size={14} />
          Pendiente
        </span>
      );
  }
};

export const MyOrdersPage: React.FC = () => {
  const { data: orders = [], isLoading, isError, refetch } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
  });

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Mis Pedidos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Historial completo y seguimiento de tus compras en EduCart
          </p>
        </div>
        <Link to="/products">
          <Button variant="secondary" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            Continuar comprando
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl border border-rose-200 dark:border-rose-800">
          <p className="font-semibold">Error al cargar tu historial de pedidos.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Reintentar
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
            <Package size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aún no tienes pedidos registrados</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm">
            Tus compras y descargas académicas aparecerán aquí para que puedas seguir su estado en todo momento.
          </p>
          <Link to="/products">
            <Button className="mt-2 font-semibold">
              Explorar Catálogo de Productos
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              {/* Encabezado de la orden */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Orden #</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white">EDU-{order.id.toString().padStart(5, '0')}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Fecha</span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total</span>
                    <p className="text-base font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {/* Lista de productos en la orden */}
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getProductImage(item.product_id)}
                          alt="Producto"
                          className="w-14 h-14 object-contain rounded-lg bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                            {item.product?.nombre || `Producto #${item.product_id}`}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Cantidad: {item.cantidad} × {formatCurrency(item.precio_unitario)}
                          </span>
                        </div>
                      </div>

                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {formatCurrency(item.cantidad * item.precio_unitario)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Detalle de ítems no disponible.</p>
                )}

                {order.shipping_address && (
                  <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Dirección de entrega: </span>
                    {order.shipping_address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
