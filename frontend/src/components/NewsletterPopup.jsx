import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Mail, Sparkles } from 'lucide-react';

const NewsletterPopup = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, { email });
      setStatus('success');
      setMessage(data.message);
      localStorage.setItem('newsletter_dismissed', 'true');
      setTimeout(() => setVisible(false), 2500);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate/50 backdrop-blur-sm px-4">
      <div className="relative bg-cream max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate/50 hover:text-slate transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-sage/10 px-8 pt-10 pb-6 text-center border-b border-sage/20">
          <div className="w-14 h-14 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-primary" size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-light text-slate tracking-widest uppercase mb-2">
            Join the Ritual
          </h2>
          <p className="text-slate/70 text-sm font-light">
            Subscribe for skincare rituals, exclusive offers, and{' '}
            <span className="font-medium text-primary">15% off</span> your first order.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-green-600" size={22} />
              </div>
              <p className="text-slate font-medium">{message}</p>
              <p className="text-slate/60 text-sm mt-1">Your 15% code is on its way!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-sage/40 bg-white px-4 py-3 text-slate focus:outline-none focus:border-primary transition-colors"
              />
              {status === 'error' && (
                <p className="text-red-500 text-xs">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-slate text-cream py-3 uppercase tracking-widest text-sm hover:bg-primary transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing...' : 'Unlock My 15% Off'}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-slate/50 text-xs hover:text-slate/70 transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
