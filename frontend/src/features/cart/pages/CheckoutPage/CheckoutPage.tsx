import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { clearCart } from '../../slice/cartSlice';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import axiosInstance from '../../../../lib/axiosInstance';
import styles from './CheckoutPage.module.css';

/* ─── Zod schema ─── */
const checkoutSchema = z
  .object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    telefono: z
      .string()
      .regex(/^\+?[0-9\s\-()]{7,15}$/, 'Teléfono inválido (7-15 dígitos)'),
    email: z.string().email('Email inválido'),
    confirmarEmail: z.string().email('Email inválido'),
  })
  .refine((data) => data.email === data.confirmarEmail, {
    message: 'Los emails no coinciden',
    path: ['confirmarEmail'],
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type ToastState =
  | { type: 'error'; message: string }
  | { type: 'success'; message: string }
  | null;

/* ─── Helper: validate one field ─── */
const validateField = <K extends keyof CheckoutFormValues>(
  field: K,
  values: Partial<CheckoutFormValues>
): string | undefined => {
  const result = checkoutSchema.safeParse({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    confirmarEmail: '',
    ...values,
  });
  if (result.success) return undefined;
  const err = result.error.issues.find((i) => i.path[0] === field);
  return err?.message;
};

export const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const [toast, setToast] = useState<ToastState>(null);

  const tax = Number((totalAmount * 0.21).toFixed(2));
  const grandTotal = Number((totalAmount + tax).toFixed(2));

  const form = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      confirmarEmail: '',
    },
    onSubmit: async ({ value }) => {
      // Validate full schema before submit
      const parsed = checkoutSchema.safeParse(value);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        setToast({ type: 'error', message: firstError.message });
        return;
      }

      setToast(null);

      try {
        const orderPayload = {
          shipping_address: `${value.nombre} ${value.apellido} - ${value.telefono} - ${value.email}`,
          items: items.map((item) => ({
            product_id: item.product.id,
            cantidad: item.cantidad,
            precio_unitario: item.product.precio,
          })),
        };

        await axiosInstance.post('/orders', orderPayload);

        dispatch(clearCart());
        setToast({ type: 'success', message: '¡Pedido realizado con éxito! Te enviaremos la confirmación por email.' });

        setTimeout(() => {
          navigate('/products');
        }, 3000);
      } catch (err: any) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail;

        // Stock rollback error from backend
        if (status === 400 || status === 409 || status === 422) {
          setToast({
            type: 'error',
            message:
              detail ||
              '❌ No hay suficiente stock para uno o más productos. Por favor revisa tu carrito.',
          });
        } else if (status === 401) {
          setToast({ type: 'error', message: 'Tu sesión expiró. Por favor inicia sesión de nuevo.' });
        } else {
          setToast({
            type: 'error',
            message: 'Error al procesar tu orden. Inténtalo de nuevo en unos momentos.',
          });
        }
      }
    },
  });

  if (items.length === 0 && !toast) {
    return (
      <div className={styles.page}>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '4rem' }}>
          Tu carrito está vacío.{' '}
          <Link to="/products" style={{ color: 'var(--color-primary)' }}>
            Volver al catálogo
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/cart" className={styles.backLink}>
        <ArrowLeft size={18} />
        Volver al carrito
      </Link>

      <h1 className={styles.title}>Checkout</h1>
      <p className={styles.subtitle}>Completa tus datos para finalizar la compra</p>

      {/* Toast notifications */}
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === 'error' ? styles.toastError : styles.toastSuccess
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle size={20} style={{ flexShrink: 0 }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className={styles.layout}>
        {/* ─── Formulario ─── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Datos de contacto</h2>

            {/* Nombre + Apellido */}
            <div className={styles.row}>
              <form.Field
                name="nombre"
                validators={{
                  onBlur: ({ value }) =>
                    validateField('nombre', { nombre: value }),
                }}
              >
                {(field) => (
                  <Input
                    id="checkout-nombre"
                    label="Nombre *"
                    placeholder="Juan"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.join(', ')}
                  />
                )}
              </form.Field>

              <form.Field
                name="apellido"
                validators={{
                  onBlur: ({ value }) =>
                    validateField('apellido', { apellido: value }),
                }}
              >
                {(field) => (
                  <Input
                    id="checkout-apellido"
                    label="Apellido *"
                    placeholder="Pérez"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.join(', ')}
                  />
                )}
              </form.Field>
            </div>

            {/* Teléfono */}
            <form.Field
              name="telefono"
              validators={{
                onBlur: ({ value }) =>
                  validateField('telefono', { telefono: value }),
              }}
            >
              {(field) => (
                <Input
                  id="checkout-telefono"
                  label="Teléfono *"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.join(', ')}
                />
              )}
            </form.Field>

            <h2 className={styles.sectionTitle}>Datos de envío / confirmación</h2>

            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) =>
                  validateField('email', { email: value }),
              }}
            >
              {(field) => (
                <Input
                  id="checkout-email"
                  label="Email *"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.join(', ')}
                />
              )}
            </form.Field>

            {/* Confirmar Email — cross-field validation via refine */}
            <form.Field
              name="confirmarEmail"
              validators={{
                onBlur: ({ value, fieldApi }) => {
                  const emailVal = (fieldApi.form.getFieldValue('email') as string) || '';
                  if (!value) return 'Debes confirmar tu email';
                  if (value !== emailVal) return 'Los emails no coinciden';
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Input
                  id="checkout-confirmar-email"
                  label="Confirmar Email *"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.join(', ')}
                />
              )}
            </form.Field>

            {/* Submit */}
            <div className={styles.submitSection}>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={!canSubmit || Boolean(isSubmitting) || items.length === 0}
                  >
                    {isSubmitting ? (
                      <span className={styles.spinnerWrap}>
                        <span className={styles.spinner} />
                        Procesando...
                      </span>
                    ) : (
                      `Confirmar pedido — $${grandTotal.toFixed(2)}`
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </div>
        </form>

        {/* ─── Sidebar resumen ─── */}
        <aside>
          <div className={styles.orderSidebar}>
            <h2 className={styles.sidebarTitle}>Tu pedido</h2>

            {items.map((item) => (
              <div key={item.product.id} className={styles.orderItem}>
                <span className={styles.orderItemName}>{item.product.nombre}</span>
                <span className={styles.orderItemQty}>× {item.cantidad}</span>
                <span className={styles.orderItemPrice}>
                  ${(item.product.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}

            <hr className={styles.divider} />

            <div className={styles.orderItem}>
              <span className={styles.orderItemName} style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span className={styles.orderItemPrice}>${totalAmount.toFixed(2)}</span>
            </div>

            <div className={styles.orderItem}>
              <span className={styles.orderItemName} style={{ color: 'var(--color-text-muted)' }}>IVA (21%)</span>
              <span className={styles.orderItemPrice}>${tax.toFixed(2)}</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
