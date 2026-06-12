// src/context/CartContext.jsx
// Contexte global du panier.
// Fournit : items, addToCart, removeFromCart, updateQuantity, clearCart, total, count.

import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter((item) => item.id !== action.id);
    case "UPDATE": {
      if (action.quantity <= 0) {
        return state.filter((item) => item.id !== action.id);
      }
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => dispatch({ type: "ADD", product });
  const removeFromCart = (id) => dispatch({ type: "REMOVE", id });
  const updateQuantity = (id, quantity) => dispatch({ type: "UPDATE", id, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}
