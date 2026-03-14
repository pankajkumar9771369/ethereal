import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, Tag, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(null); // { code, type, value, savings }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getCartTotal();
  const savings = discount?.savings || 0;
  const isFreeShipping = discount?.type === 'free_shipping' || subtotal >= 50;
  const total = Math.max(0, subtotal - savings);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/discounts/apply`, {
        code: couponCode.trim(),
        orderTotal: subtotal,
      });
      setDiscount(data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid code');
      setDiscount(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      navigate('/login?redirect=/');
      return;
    }
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/checkout/create-session`, {
        cartItems,
        userId: user?._id || '',
      });
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert('Checkout failed. Make sure backend is running and keys are valid.');
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full flex bg-cream shadow-2xl z-50 transform transition-transform duration-500 ease-in-out">
        <div className="flex-1 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-sage/20">
            <h2 className="text-xl font-medium tracking-widest text-slate uppercase">Your Bag
              {cartItems.length > 0 && <span className="ml-2 text-sm font-normal text-slate/50">({cartItems.length})</span>}
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-slate/60 hover:text-slate transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate/60">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="font-light tracking-wider">Your bag is currently empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 text-sm border-b border-slate text-slate hover:text-primary hover:border-primary transition-colors pb-1 uppercase tracking-widest"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {cartItems.map(item => (
                  <li key={item._id} className="flex gap-4 border-b border-sage/10 pb-6 last:border-0">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-white/50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <Link to={`/product/${item._id}`} onClick={() => setIsCartOpen(false)} className="text-sm font-medium text-slate hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-sm font-medium text-slate ml-4">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate/60">{item.volume || item.category}</p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center border border-slate/20 w-24">
                          <button className="px-2 py-1 text-slate/60 hover:text-slate hover:bg-sage/10 transition-colors" onClick={() => updateQuantity(item._id, item.qty - 1)}>
                            <Minus size={14} />
                          </button>
                          <span className="flex-1 text-center text-sm font-medium text-slate">{item.qty}</span>
                          <button className="px-2 py-1 text-slate/60 hover:text-slate hover:bg-sage/10 transition-colors" onClick={() => updateQuantity(item._id, item.qty + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <button className="text-xs uppercase tracking-wider text-slate/60 hover:text-red-500 transition-colors underline" onClick={() => removeFromCart(item._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Upsell Section */}
            {cartItems.length > 0 && cartItems.length < 3 && (
              <div className="mt-8 pt-6 border-t border-sage/20">
                <p className="text-xs uppercase tracking-widest text-slate/60 mb-4 font-medium">You might also like</p>
                <div className="bg-white p-4 border border-sage/10 rounded flex gap-4 items-center group">
                  <div className="w-16 h-16 bg-cream flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=200&q=80" alt="Mineral SPF 50" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate line-clamp-1">Everyday Mineral SPF 50</p>
                    <p className="text-sm text-slate/60 mt-0.5">$38.00</p>
                  </div>
                  <button 
                    onClick={() => {
                       const upsellItem = { _id: 'upsell_spf_1', name: 'Everyday Mineral SPF 50', price: 38, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=200&q=80', volume: '50ml', countInStock: 50 };
                       // The cart context looks for qty
                       upsellItem.qty = 1;
                       
                       // check if already added
                       if (!cartItems.find(i => i._id === 'upsell_spf_1')) {
                         // We can't directly addToCart since that function expects (product, qty) and handles alerts. We'll just call the hook's addToCart
                         try {
                            // Since useCart addToCart adds qty to existing, we can just call it
                            const qty = 1;
                             let newCart = [...cartItems];
                             newCart.push({ ...upsellItem, qty: Number(qty) });
                             localStorage.setItem('cartItems', JSON.stringify(newCart));
                             // Force reload the page to make it simple and bulletproof, or rely on context to update it later. We'll rely on a clean reload for immediate effect
                             window.location.reload();
                         } catch (e) {}
                       }
                    }}
                    className="text-xs uppercase tracking-widest bg-slate/5 hover:bg-slate text-slate hover:text-cream px-3 py-2 transition-colors rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-sage/20 px-6 py-5 bg-cream space-y-4">

              {/* Coupon Code */}
              {discount ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={16} />
                    <span><strong>{discount.code}</strong> applied — saved ${savings.toFixed(2)}</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        placeholder="DISCOUNT CODE"
                        className="w-full pl-8 pr-3 py-2.5 border border-sage/30 bg-white text-slate text-xs tracking-wider focus:outline-none focus:border-primary transition-colors placeholder-slate/30"
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="bg-slate text-cream px-4 text-xs uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                  <p className="text-xs text-slate/40">Try: ETHEREAL10</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-2 text-sm pt-1">
                <div className="flex justify-between text-slate/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount?.code})</span>
                    <span>−${savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate/70">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? 'text-green-600' : ''}>{isFreeShipping ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-slate border-t border-sage/20 pt-2 mt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {!isFreeShipping && (
                <p className="text-xs text-center text-earth font-medium border border-earth/30 bg-earth/5 py-2">
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-slate text-cream py-4 flex justify-center items-center text-sm uppercase tracking-widest hover:bg-primary transition-colors"
              >
                Proceed to Checkout
              </button>
              <p className="text-xs text-slate/40 text-center tracking-wider">Secure checkout · SSL encrypted</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
