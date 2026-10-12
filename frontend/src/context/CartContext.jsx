import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  // Load cart when user logs in as customer
  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      loadCart();
    } else if (!isAuthenticated) {
      // Load local guest cart from localStorage
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart({ items: [], totalAmount: 0 });
        }
      } else {
        setCart({ items: [], totalAmount: 0 });
      }
    }
  }, [isAuthenticated, isCustomer]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data || { items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (food, quantity = 1) => {
    if (isAuthenticated && isCustomer) {
      try {
        const updated = await cartService.addToCart(food.id, quantity);
        setCart(updated);
        return updated;
      } catch (err) {
        console.error('Add to cart error:', err);
        throw err;
      }
    } else {
      // Local cart fallback
      setCart((prevCart) => {
        const items = [...(prevCart.items || [])];
        const existingIndex = items.findIndex((i) => i.food?.id === food.id);

        if (existingIndex > -1) {
          items[existingIndex] = {
            ...items[existingIndex],
            quantity: items[existingIndex].quantity + quantity,
          };
        } else {
          items.push({
            id: Date.now(),
            food,
            quantity,
            price: food.price,
          });
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newCart = { items, totalAmount };
        localStorage.setItem('guest_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated && isCustomer) {
      try {
        const updated = await cartService.updateQuantity(itemId, quantity);
        setCart(updated);
        return updated;
      } catch (err) {
        console.error('Update quantity error:', err);
        throw err;
      }
    } else {
      setCart((prevCart) => {
        let items = [...(prevCart.items || [])];
        if (quantity <= 0) {
          items = items.filter((i) => i.id !== itemId);
        } else {
          items = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
        }
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newCart = { items, totalAmount };
        localStorage.setItem('guest_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated && isCustomer) {
      try {
        const updated = await cartService.removeItem(itemId);
        setCart(updated);
        return updated;
      } catch (err) {
        console.error('Remove item error:', err);
        throw err;
      }
    } else {
      setCart((prevCart) => {
        const items = (prevCart.items || []).filter((i) => i.id !== itemId);
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newCart = { items, totalAmount };
        localStorage.setItem('guest_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && isCustomer) {
      try {
        const updated = await cartService.clearCart();
        setCart(updated || { items: [], totalAmount: 0 });
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    } else {
      localStorage.removeItem('guest_cart');
      setCart({ items: [], totalAmount: 0 });
    }
  };

  const cartCount = (cart.items || []).reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
