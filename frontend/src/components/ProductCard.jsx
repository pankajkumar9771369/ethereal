import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group hover-lift">
      <div className="relative overflow-hidden bg-cream aspect-w-4 aspect-h-5 mb-4">
        {/* Sale Badge */}
        {product.comparePrice > product.price && (
          <div className="absolute top-4 left-4 z-10 bg-slate text-cream text-xs px-2 py-1 uppercase tracking-wider">
            Sale
          </div>
        )}
        
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-[350px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </Link>
        
        {/* Quick Add Button */}
        <button className="absolute bottom-0 left-0 w-full bg-slate text-cream py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out flex justify-center items-center gap-2 text-sm uppercase tracking-wider">
          <ShoppingBag size={16} /> Add to Bag
        </button>
      </div>
      
      <div className="flex flex-col text-left">
        <h3 className="text-slate text-lg font-medium">
          <Link to={`/product/${product._id}`} className="hover:text-earth transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-slate/60 text-sm mb-2">{product.category}</p>
        <div className="flex items-center gap-3">
          <span className="text-slate font-medium">${product.price}</span>
          {product.comparePrice > product.price && (
            <span className="text-slate/40 line-through text-sm">${product.comparePrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
