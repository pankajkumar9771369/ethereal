import React from 'react';
import { Link } from 'react-router-dom';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.55c0-1.45.84-2.54 1.88-2.54.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.28-1.95 3.28-4.77 0-2.49-1.79-4.23-4.34-4.23-2.96 0-4.69 2.22-4.69 4.51 0 .89.34 1.85.77 2.37.08.1.09.19.07.3-.08.32-.25 1.04-.28 1.18-.04.19-.14.23-.32.14-1.25-.58-2.03-2.42-2.03-3.89 0-3.15 2.29-6.05 6.61-6.05 3.47 0 6.16 2.47 6.16 5.77 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.3-1.15l-.62 2.33c-.23.87-.84 1.96-1.25 2.62.94.29 1.94.45 2.97.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34l-.02-8.5A8.18 8.18 0 0020 8.26V4.83a4.85 4.85 0 01-.41-.14z"/>
  </svg>
);

const Footer = () => (
  <footer className="bg-slate text-cream">
    {/* Newsletter Strip */}
    <div className="bg-primary/80 py-10 px-4 text-center">
      <p className="text-xl font-light tracking-widest uppercase mb-1">Join the Ritual</p>
      <p className="text-cream/70 text-sm mb-5 font-light">Get 15% off your first order + skincare tips delivered to your inbox.</p>
      <form
        onSubmit={e => e.preventDefault()}
        className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 bg-white/10 border border-cream/30 text-cream placeholder-cream/50 px-4 py-3 text-sm focus:outline-none focus:border-cream focus:bg-white/20 transition-colors"
        />
        <button type="submit" className="bg-earth text-cream px-6 py-3 text-xs uppercase tracking-widest hover:bg-earth/80 transition-colors flex-shrink-0">
          Subscribe
        </button>
      </form>
    </div>

    {/* Main Footer Grid */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <Link to="/" className="text-2xl tracking-widest font-light text-cream block mb-4">ETHEREAL</Link>
          <p className="text-cream/50 text-sm font-light leading-relaxed mb-6">
            Premium botanical skincare formulated to restore balance, enhance glow, and nourish your skin barrier.
          </p>
          <div className="flex gap-4">
            {[
              { href: 'https://instagram.com', icon: <InstagramIcon />, label: 'Instagram' },
              { href: 'https://tiktok.com', icon: <TikTokIcon />, label: 'TikTok' },
              { href: 'https://pinterest.com', icon: <PinterestIcon />, label: 'Pinterest' },
            ].map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-cream/60 transition-all duration-200"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-cream/50 mb-5 font-medium">Shop</h3>
          <ul className="space-y-3">
            {[
              { to: '/shop', label: 'Shop All' },
              { to: '/collections/bestsellers', label: 'Bestsellers' },
              { to: '/collections/serums', label: 'Serums' },
              { to: '/collections/moisturizers', label: 'Moisturizers' },
              { to: '/collections/sale', label: 'Sale 🔖' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-cream/60 hover:text-cream transition-colors font-light">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-cream/50 mb-5 font-medium">Company</h3>
          <ul className="space-y-3">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/faq', label: 'FAQ' },
              { to: '/admin-login', label: 'Admin Portal' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-cream/60 hover:text-cream transition-colors font-light">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-cream/50 mb-5 font-medium">Support</h3>
          <ul className="space-y-3">
            {[
              { to: '/shipping-returns', label: 'Shipping & Returns' },
              { to: '/privacy-policy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms of Service' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-cream/60 hover:text-cream transition-colors font-light">{label}</Link>
              </li>
            ))}
            <li>
              <a href="mailto:support@ethereal.com" className="text-sm text-cream/60 hover:text-cream transition-colors font-light">
                support@ethereal.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-cream/10 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-cream/30 text-xs font-light">
        <p>© 2026 Ethereal Skincare. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="tracking-wider">WE ACCEPT</span>
          {['VISA', 'MC', 'AMEX', 'PayPal'].map(pm => (
            <span key={pm} className="border border-cream/20 px-2 py-1 rounded text-[10px] tracking-wider text-cream/40">
              {pm}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
