import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, CheckCircle, Clock, Truck, Package, MapPin } from 'lucide-react';

const STEPS = [
  { key: 'ordered',   label: 'Order Placed',  icon: CheckCircle },
  { key: 'paid',      label: 'Payment Confirmed', icon: Package },
  { key: 'shipped',   label: 'Shipped',        icon: Truck },
  { key: 'delivered', label: 'Delivered',       icon: MapPin },
];

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  // Determine current step index
  const getStepIndex = (order) => {
    if (!order) return 0;
    if (order.isDelivered) return 3;
    if (order.isPaid) return 2; // simplified: paid → processing/shipped
    if (order._id) return 0;
    return 0;
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
        <p className="text-slate/60">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Order not found.'}</p>
          <Link to="/profile" className="text-slate underline">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/profile" className="text-slate/60 hover:text-slate flex items-center text-sm uppercase tracking-wider transition-colors mb-4">
            <ChevronLeft size={16} className="mr-1" /> My Orders
          </Link>
          <h1 className="text-3xl font-light text-slate">Order Tracking</h1>
          <p className="text-slate/60 text-sm mt-1">Order #{order._id.substring(0, 8).toUpperCase()}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white p-8 shadow-sm border border-sage/20 mb-6">
          <h2 className="text-sm uppercase tracking-widest text-slate/60 mb-8">Delivery Status</h2>
          <div className="relative flex justify-between items-start">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-sage/20 z-0" />
            <div
              className="absolute top-6 left-0 h-0.5 bg-sage transition-all duration-500 z-0"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    isCompleted
                      ? 'bg-sage text-cream shadow-md'
                      : 'bg-white border-2 border-sage/30 text-slate/30'
                  } ${isCurrent ? 'ring-4 ring-sage/20' : ''}`}>
                    <Icon size={20} />
                  </div>
                  <p className={`text-xs text-center font-medium uppercase tracking-wider leading-tight max-w-[80px] ${
                    isCompleted ? 'text-slate' : 'text-slate/40'
                  }`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="mt-1 text-xs text-earth font-medium flex items-center gap-1">
                      <Clock size={10} /> Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-cream/50 p-4 border border-sage/20 text-sm">
            <p className="text-slate/60 uppercase tracking-widest text-xs mb-2">Status</p>
            <p className="font-medium text-slate">
              {order.isDelivered
                ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                : order.isPaid
                ? 'Your order has been confirmed and is being processed'
                : 'Awaiting payment confirmation'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-8 shadow-sm border border-sage/20 mb-6">
          <h2 className="text-sm uppercase tracking-widest text-slate/60 mb-6">Items Ordered</h2>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex gap-4 border-b border-sage/10 pb-4 last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-cream flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium text-slate hover:text-earth cursor-pointer transition-colors"
                    onClick={() => navigate(`/product/${item.product}`)}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-slate/60 mt-1">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-medium text-slate">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 shadow-sm border border-sage/20">
          <h2 className="text-sm uppercase tracking-widest text-slate/60 mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate/70">
              <span>Order Date</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-slate/70">
              <span>Payment</span>
              <span className={order.isPaid ? 'text-green-600' : 'text-amber-600'}>
                {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Pending'}
              </span>
            </div>
            {order.shippingAddress?.address !== 'N/A' && (
              <div className="flex justify-between text-slate/70">
                <span>Ship To</span>
                <span className="text-right max-w-[200px]">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate/70">
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-sage/20 pt-3 flex justify-between font-medium text-slate text-base">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
