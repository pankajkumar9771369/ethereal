import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, User, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <nav className="fixed w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate hover:text-primary transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center flex-1 sm:flex-none sm:justify-start">
            <Link to="/" className="text-2xl tracking-widest font-light text-slate">ETHEREAL</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
            <Link to="/shop" className="text-slate hover:text-primary transition-colors px-3 py-2 text-sm uppercase tracking-wider">Shop All</Link>
            <Link to="/collections/bestsellers" className="text-slate hover:text-primary transition-colors px-3 py-2 text-sm uppercase tracking-wider">Bestsellers</Link>
            <Link to="/about" className="text-slate hover:text-primary transition-colors px-3 py-2 text-sm uppercase tracking-wider">About</Link>
            <Link to="/contact" className="text-slate hover:text-primary transition-colors px-3 py-2 text-sm uppercase tracking-wider">Contact</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/shop" className="text-slate hover:text-primary transition-colors hidden sm:block" aria-label="Search">
              <Search size={18} />
            </Link>
            {user ? (
              <Link to="/profile" className="text-slate hover:text-primary transition-colors">
                <User size={20} />
              </Link>
            ) : (
              <Link to="/login" className="text-slate text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider hidden sm:block">
                Log In
              </Link>
            )}
            {!user?.isAdmin && (
              <button onClick={() => setIsCartOpen(true)} className="text-slate hover:text-primary transition-colors relative">
                <ShoppingBag size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-earth text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{getCartCount()}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-cream border-t border-sage/20">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {[
              { to: '/shop', label: 'Shop All' },
              { to: '/collections/bestsellers', label: 'Bestsellers' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/faq', label: 'FAQ' },
              { to: '/shipping-returns', label: 'Shipping & Returns' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate hover:bg-sage/10 hover:text-primary transition-colors rounded">
                {label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate hover:bg-sage/10 transition-colors rounded">
                Log In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
