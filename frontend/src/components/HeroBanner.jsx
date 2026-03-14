import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="relative h-screen bg-cream overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sage/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-earth/20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-light text-slate tracking-tight mb-6">
          <span className="block">Reveal Your</span>
          <span className="block text-gradient mt-2">Natural Radiance</span>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-slate/80 max-w-2xl mx-auto mb-10 font-light">
          Premium, botanical skincare formulated to restore balance, enhance glow, and nourish your skin barrier.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/shop"
            className="px-8 py-4 bg-slate text-cream rounded-none hover:bg-sage transition-all duration-300 uppercase tracking-widest text-sm"
          >
            Shop Collection
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-transparent border border-slate text-slate hover:bg-sage/10 transition-all duration-300 uppercase tracking-widest text-sm"
          >
            Discover Ethereal
          </Link>
        </div>
      </div>
      
      {/* Hero Image (Absolute positioning for large screens) */}
      <div className="absolute bottom-0 right-0 w-1/3 h-2/3 hidden lg:block opacity-90 transform translate-x-12 translate-y-12">
        <img 
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Ethereal Skincare Products" 
          className="object-cover w-full h-full rounded-tl-[100px] shadow-2xl"
        />
      </div>
    </div>
  );
};

export default HeroBanner;
