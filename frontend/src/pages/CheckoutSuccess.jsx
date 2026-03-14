import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState(null);
  const [saving, setSaving] = useState(true);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const createOrder = async () => {
      if (!sessionId) {
        setSaving(false);
        return;
      }

      clearCart();

      if (!user) {
        // Not logged in — can't create order
        setSaving(false);
        setSaveError('Please log in to view your order.');
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/checkout/session/${sessionId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setOrderId(data.orderId);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Unknown error';
        console.error('Order save error:', msg, err.response?.status);
        setSaveError(`Order was placed but could not be saved: ${msg}`);
      } finally {
        setSaving(false);
      }
    };

    createOrder();
  }, [sessionId]); // eslint-disable-line

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white p-8 md:p-12 text-center shadow-sm">
        <div className="flex justify-center mb-6">
          {saving ? (
            <Loader className="text-earth animate-spin" size={64} strokeWidth={1} />
          ) : (
            <CheckCircle className="text-earth" size={64} strokeWidth={1} />
          )}
        </div>

        <h1 className="text-3xl font-light text-slate mb-4">
          {saving ? 'Confirming Order...' : 'Order Confirmed'}
        </h1>

        <p className="text-slate/70 font-light mb-8">
          {saving
            ? 'Please wait while we save your order details...'
            : 'Thank you for your purchase. Your ethereal skincare journey begins soon.'}
        </p>

        {saveError && (
          <div className="bg-amber-50 text-amber-700 p-3 mb-6 text-sm border border-amber-200">
            {saveError}
          </div>
        )}

        <div className="bg-cream/50 p-4 mb-8 text-sm text-left border border-sage/20">
          <p className="text-slate/60 mb-1 uppercase tracking-widest text-xs">Order Reference</p>
          <p className="font-medium text-slate truncate text-xs">{sessionId || 'ORD-9824XJ'}</p>
        </div>

        {!saving && (
          <div className="space-y-3">
            {orderId ? (
              <Link
                to={`/order/${orderId}`}
                className="block w-full bg-slate text-cream py-4 text-sm uppercase tracking-widest hover:bg-sage transition-colors"
              >
                Track My Order
              </Link>
            ) : (
              <Link
                to="/profile"
                className="block w-full bg-slate text-cream py-4 text-sm uppercase tracking-widest hover:bg-sage transition-colors"
              >
                View My Orders
              </Link>
            )}
            <Link
              to="/"
              className="block w-full border border-slate text-slate py-4 text-sm uppercase tracking-widest hover:bg-slate/5 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
