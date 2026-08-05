import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../../types';

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalAmount = items.reduce(
    (acc, item) => acc + item.product.precio * item.cantidad,
    0
  );
  return { totalQuantity, totalAmount: Number(totalAmount.toFixed(2)) };
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; cantidad?: number }>
    ) => {
      const { product, cantidad = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        const newQuantity = state.items[existingIndex].cantidad + cantidad;
        // Respetar stock máximo disponible
        const maxStock = product.stock_actual;
        state.items[existingIndex].cantidad = Math.min(newQuantity, maxStock);
      } else {
        const initialQuantity = Math.min(cantidad, product.stock_actual);
        if (initialQuantity > 0) {
          state.items.push({ product, cantidad: initialQuantity });
        }
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; cantidad: number }>
    ) => {
      const { productId, cantidad } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === productId
      );

      if (existingIndex >= 0) {
        if (cantidad <= 0) {
          state.items.splice(existingIndex, 1);
        } else {
          const maxStock = state.items[existingIndex].product.stock_actual;
          state.items[existingIndex].cantidad = Math.min(cantidad, maxStock);
        }
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
