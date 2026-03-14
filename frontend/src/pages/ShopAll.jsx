import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Serums', 'Cleansers', 'Moisturizers', 'Sun Care', 'Masks', 'Toners', 'Eye Care', 'Lip Care'];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'On Sale', value: 'sale' },
];

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then(({ data }) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'sale') return (b.comparePrice ? 1 : 0) - (a.comparePrice ? 1 : 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      {/* Header */}
      <div className="bg-sage/10 py-16 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-slate tracking-widest uppercase mb-3">Shop All</h1>
        <p className="text-slate/60 font-light max-w-xl mx-auto">
          Discover our complete range of botanical skincare, crafted for every skin type and concern.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-sage/30 bg-white text-slate focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-slate/50" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-sage/30 bg-white px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-slate text-cream border-slate'
                  : 'bg-white text-slate border-sage/30 hover:border-slate'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center text-slate/60 py-20">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate/50 text-lg font-light">No products found.</p>
            <button onClick={() => { setActiveCategory('All'); setSearch(''); }} className="mt-4 text-sm text-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-slate/50 text-sm mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopAll;
