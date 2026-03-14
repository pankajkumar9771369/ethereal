import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import NewsletterPopup from './components/NewsletterPopup';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerify from './pages/OtpVerify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderDetail from './pages/OrderDetail';
import UserProfile from './pages/UserProfile';
import ShopAll from './pages/ShopAll';
import CollectionPage from './pages/CollectionPage';
import AboutPage from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductUpload from './pages/admin/ProductUpload';
import BulkUpload from './pages/admin/BulkUpload';
import AdminLogin from './pages/admin/AdminLogin';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <NewsletterPopup />

          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopAll />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/collections/:id" element={<CollectionPage />} />
              <Route path="/success" element={<CheckoutSuccess />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<OtpVerify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<UserProfile />} />

              {/* Info Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* Admin */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="product/new" element={<ProductUpload />} />
                <Route path="product/bulk" element={<BulkUpload />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
