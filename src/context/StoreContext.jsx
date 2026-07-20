import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, INITIAL_ORDERS } from '../data/mockData';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Cart state stored in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cn_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User auth state
  const [user, setUser] = useState(() => {
    try {
      const uid = localStorage.getItem('uid');
      const uname = localStorage.getItem('uname');
      return uid ? { id: uid, name: uname || 'User' } : null;
    } catch {
      return null;
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('cn_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('cn_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cn_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product_id === product.product_id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += quantity;
        return updated;
      }
      return [...prev, { ...product, qty: quantity }];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product_id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const loginUser = (email, name = 'User') => {
    const newUser = { id: 'usr_' + Date.now(), email, name };
    setUser(newUser);
    localStorage.setItem('uid', newUser.id);
    localStorage.setItem('uname', newUser.name);
    showToast(`Welcome back, ${name}!`);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('uid');
    localStorage.removeItem('uname');
    showToast('Logged out successfully');
  };

  const placeOrder = (orderDetails) => {
    const newOrder = {
      order_id: 'CN-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      total_amount: orderDetails.total,
      items: cart.map((c) => ({
        product_name: c.name,
        qty: c.qty,
        price: c.price,
      })),
      shipping: orderDetails.shipping,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast('Order placed successfully! 🎉');
    return newOrder.order_id;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        user,
        orders,
        toast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        loginUser,
        logoutUser,
        placeOrder,
        showToast,
        totalCartItems,
        cartSubtotal,
        products: PRODUCTS,
      }}
    >
      {children}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-semibold text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white'
              : toast.type === 'info'
              ? 'bg-slate-800 text-white'
              : 'bg-emerald-700 text-white'
          }`}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
