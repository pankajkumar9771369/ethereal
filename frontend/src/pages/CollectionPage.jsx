import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ChevronLeft } from 'lucide-react';

const COLLECTION_MAP = {
  bestsellers: { label: 'Bestsellers', tag: 'bestseller', desc: 'Our most-loved formulas, trusted by thousands of skincare enthusiasts.' },
  serums: { label: 'Serums', category: 'Serums', desc: 'Targeted treatments that penetrate deep to deliver potent actives.' },
  cleansers: { label: 'Cleansers', category: 'Cleansers', desc: 'Gentle yet effective formulas to purify and prepare your skin.' },
  moisturizers: { label: 'Moisturizers', category: 'Moisturizers', desc: 'Replenish and protect your skin barrier around the clock.' },
  masks: { label: 'Masks', category: 'Masks', desc: 'Weekly treatments for an at-home spa ritual.' },
  'sun-care': { label: 'Sun Care', category: 'Sun Care', desc: 'Mineral broad-spectrum protection for daily UV defense.' },
  toners: { label: 'Toners', category: 'Toners', desc: 'Balance and prep your skin for maximum absorption.' },
  'eye-care': { label: 'Eye Care', category: 'Eye Care', desc: 'Targeted formulas for the delicate eye area.' },
  sale: { label: 'Sale', sale: true, desc: 'Limited-time offers on fan-favourite formulas.' },
};

const CollectionPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const collection = COLLECTION_MAP[id] || { label: id, desc: '' };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then(({ data }) => {
        let filtered = data;
        if (collection.category) {
          filtered = data.filter(p => p.category === collection.category);
        } else if (collection.tag) {
          filtered = data.filter(p => p.tags && p.tags.includes(collection.tag));
        } else if (collection.sale) {
          filtered = data.filter(p => p.comparePrice && p.comparePrice > p.price);
        }
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      {/* Header */}
      <div className="bg-sage/10 py-16 text-center mb-12">
        <Link to="/shop" className="inline-flex items-center text-sm text-slate/50 hover:text-primary mb-4 uppercase tracking-wider transition-colors">
          <ChevronLeft size={16} /> All Collections
        </Link>
        <h1 className="text-4xl md:text-5xl font-light text-slate tracking-widest uppercase mb-3">{collection.label}</h1>
        <p className="text-slate/60 font-light max-w-xl mx-auto">{collection.desc}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-slate/50">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate/50 text-lg font-light">No products found in this collection.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm text-primary hover:underline">Browse all products</Link>
          </div>
        ) : (
          <>
            <p className="text-slate/50 text-sm mb-6">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
