import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ToolsPage from './pages/ToolsPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeaturePage from './pages/FeaturePage';

// Auth pages render without Navbar/Footer so they can go full-screen
const AUTH_ROUTES = ['/login', '/register'];

export default function App() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#fcfbf7] font-sans antialiased text-slate-900 selection:bg-mint selection:text-forest-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/upload-prescription" element={<UploadPrescriptionPage />} />
            <Route path="/feature/:featureId" element={<FeaturePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
