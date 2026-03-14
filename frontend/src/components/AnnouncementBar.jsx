import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const fetchLatestDiscount = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/discounts/latest`);
        setDiscount(data);
      } catch (error) {
        // No active discounts, silently fall back to default text or null
        console.error('No active discounts found');
      }
    };
    fetchLatestDiscount();
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-slate text-cream text-xs md:text-sm py-2 px-4 text-center relative tracking-wider">
      <span>
        🌿 FREE SHIPPING on orders over $50 &nbsp;·&nbsp; 
        {discount ? (
          <>
            Use code <span className="font-semibold underline underline-offset-2">{discount.code}</span> for{' '}
            {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`} off your order
          </>
        ) : (
          <>
            Use code <span className="font-semibold underline underline-offset-2">ETHEREAL10</span> for 10% off your first order
          </>
        )}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
