import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/mockData';
import { useAuth, useUser } from '@clerk/clerk-react';
import { db } from '../firebase';
import { doc, setDoc, collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

  // Load Cart from Firebase or localStorage
  useEffect(() => {
    if (!isLoaded) return;
    if (userId) {
      const unsub = onSnapshot(doc(db, 'carts', userId), (docSnap) => {
        if (docSnap.exists()) {
          setCart(docSnap.data().items || []);
        } else {
          // Check if there's a local cart to migrate to cloud
          const localCart = localStorage.getItem('cn_cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            if (parsedCart.length > 0) {
              setDoc(doc(db, 'carts', userId), { items: parsedCart });
              setCart(parsedCart);
              localStorage.removeItem('cn_cart');
              return;
            }
          }
          setCart([]);
        }
      });
      return () => unsub();
    } else {
      const saved = localStorage.getItem('cn_cart');
      setCart(saved ? JSON.parse(saved) : []);
    }
  }, [userId, isLoaded]);

  // Load Orders from Firebase
  useEffect(() => {
    if (!isLoaded) return;
    if (userId) {
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        // Sort by date descending
        fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(fetchedOrders);
      });
      return () => unsub();
    } else {
      setOrders([]);
    }
  }, [userId, isLoaded]);

  const syncCart = async (newCart) => {
    if (userId) {
      await setDoc(doc(db, 'carts', userId), { items: newCart });
    } else {
      setCart(newCart);
      localStorage.setItem('cn_cart', JSON.stringify(newCart));
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => item.product_id === product.product_id);
    if (existingIndex > -1) {
      newCart[existingIndex].qty += quantity;
    } else {
      newCart.push({ ...product, qty: quantity });
    }
    syncCart(newCart);
    showToast(`Added ${product.name} to cart!`);
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) => (item.product_id === productId ? { ...item, qty: newQty } : item));
    syncCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.product_id !== productId);
    syncCart(newCart);
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    syncCart([]);
  };

  const placeOrder = async (orderDetails) => {
    const orderData = {
      userId: userId || 'guest',
      order_id: 'CN-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      total_amount: orderDetails.total,
      paymentMethod: orderDetails.paymentMethod,
      paymentId: orderDetails.paymentId || null,
      items: cart.map((c) => ({
        product_name: c.name,
        qty: c.qty,
        price: c.price,
      })),
      shipping: orderDetails.shipping,
    };
    
    if (userId) {
      await addDoc(collection(db, 'orders'), orderData);
    } else {
      setOrders(prev => [orderData, ...prev]);
    }

    clearCart();
    showToast('Order placed successfully! 🎉');
    return orderData.order_id;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        orders,
        user, // Provided for backwards compatibility with UploadPrescriptionPage
        toast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
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
