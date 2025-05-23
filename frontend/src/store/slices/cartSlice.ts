import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  totalItems: number;
}

const loadCartFromStorage = () => {
  try {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
};

const initialItems = loadCartFromStorage();
const initialState: CartState = {
  items: initialItems,
  total: initialItems.reduce((total, item) => total + (item.price * item.quantity), 0),
  totalItems: initialItems.reduce((total, item) => total + item.quantity, 0),
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

const recalcTotals = (state: CartState) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: CartItem; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stock: product.stock,
        });
      }

      recalcTotals(state);
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      recalcTotals(state);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) {
        item.quantity = quantity;
        recalcTotals(state);
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalItems = 0;
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export type { CartState }; 