import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { Star, Quote, ArrowRight, Leaf, Droplet, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sophia M.',
    location: 'New York, NY',
    rating: 5,
    text: 'The Ethereal Glow Serum changed my skin completely. After just 3 weeks, my dark spots faded and my skin has this beautiful natural luminosity. I get compliments constantly.',
    product: 'Ethereal Glow Serum',
    avatar: 'S',
  },
  {
    name: 'Amara T.',
    location: 'London, UK',
    rating: 5,
    text: "I've tried luxury skincare for years and nothing compares to the Revitalizing Night Cream. My skin feels like it's been on a spa vacation every single morning.",
    product: 'Revitalizing Night Cream',
    avatar: 'A',
  },
  {
    name: 'Chloe R.',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'As someone with sensitive skin, finding products I can trust is hard. Ethereal\'s Botanical Cleansing Oil is the only cleanser that doesn\'t cause redness. Absolutely love it.',
    product: 'Botanical Cleansing Oil',
    avatar: 'C',
  },
];

const COLLECTIONS = [
  { slug: 'serums', label: 'Serums', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', desc: 'Potent actives' },
  { slug: 'moisturizers', label: 'Moisturizers', image: 'https://images.unsplash.com/photo-1615397323758-1e411b9a9f24?auto=format&fit=crop&w=600&q=80', desc: 'Barrier repair' },
  { slug: 'masks', label: 'Masks', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', desc: 'Weekly rituals' },
  { slug: 'sun-care', label: 'Sun Care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80', desc: 'Daily defence' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then(({ data }) => { setProducts(data); setLoading(false); })
      .catch(() => {
        setProducts([
          { _id: '1', name: 'Ethereal Glow Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', description: 'Deeply hydrating serum', category: 'Serums', price: 65, comparePrice: 85 },
          { _id: '2', name: 'Botanical Cleansing Oil', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', description: 'Gentle botanical cleansing oil', category: 'Cleansers', price: 42 },
          { _id: '3', name: 'Revitalizing Night Cream', image: 'https://images.unsplash.com/photo-1615397323758-1e411b9a9f24?auto=format&fit=crop&w=800&q=80', description: 'Repair overnight', category: 'Moisturizers', price: 78 },
          { _id: '4', name: 'Mineral SPF 50 Sunscreen', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80', description: 'Broad spectrum protection', category: 'Sun Care', price: 38 },
        ]);
        setLoading(false);
      });
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, { email });
    } catch {}
    setSubscribed(true);
  };

  return (
    <div>
      <HeroBanner />

      {/* ─── Trust Badges Strip ─── */}
      <section className="py-6 bg-white border-y border-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-slate/70 text-xs uppercase tracking-widest">
            {[
              { icon: <Truck size={16} />, text: 'Free Shipping Over $50' },
              { icon: <Shield size={16} />, text: '30-Day Guarantee' },
              { icon: <RotateCcw size={16} />, text: 'Easy Returns' },
              { icon: <Leaf size={16} />, text: '100% Vegan' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 font-medium">
                <span className="text-primary">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Collections ─── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-slate tracking-widest uppercase mb-3">Shop by Collection</h2>
            <p className="text-slate/50 font-light">Expertly curated rituals for every skin concern.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {COLLECTIONS.map(col => (
              <Link key={col.slug} to={`/collections/${col.slug}`} className="group relative overflow-hidden aspect-square bg-sage/10">
                <img src={col.image} alt={col.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-cream">
                  <p className="text-xs uppercase tracking-widest text-cream/70 mb-1">{col.desc}</p>
                  <h3 className="text-lg font-light tracking-wider">{col.label}</h3>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-cream text-slate rounded-full p-1">
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Best-Sellers Grid ─── */}
      <section className="py-24 bg-white" id="bestsellers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-earth mb-2 font-medium">Customer Favourites</p>
            <h2 className="text-3xl md:text-4xl font-light text-slate mb-4">Cult Favorites</h2>
            <p className="text-slate/50 text-lg max-w-2xl mx-auto font-light">
              Discover our most loved formulas, carefully crafted to deliver visible results and a luxurious experience.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-8 text-slate/40">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 border border-slate text-slate hover:bg-slate hover:text-cream transition-all duration-300 uppercase tracking-widest text-sm group">
              View All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Brand Story / USP ─── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
                alt="Ethereal Brand Story"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-sage/20 w-48 h-48 -z-10" />
              <div className="absolute -top-6 -left-6 bg-earth/10 w-32 h-32 -z-10" />
            </div>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-widest text-earth font-medium">Our Philosophy</p>
              <h2 className="text-3xl md:text-4xl font-light text-slate tracking-wide leading-snug">
                Where Nature Meets Modern Science
              </h2>
              <div className="h-px bg-sage/30 w-16" />
              <p className="text-slate/70 font-light leading-relaxed">
                Ethereal Skincare was born from a desire to strip away the synthetic and embrace the pure. We source rare botanical ingredients globally, ensuring every drop respects the earth while delivering unparalleled clinical results.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                {[
                  { icon: <Leaf size={22} strokeWidth={1.5} />, label: '100% Vegan' },
                  { icon: <Droplet size={22} strokeWidth={1.5} />, label: 'Pure Actives' },
                  { icon: <Sparkles size={22} strokeWidth={1.5} />, label: 'Clean Science' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-primary">{icon}</div>
                    <p className="text-xs text-slate uppercase tracking-widest font-medium">{label}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm text-slate hover:text-primary transition-colors uppercase tracking-widest border-b border-slate pb-1 hover:border-primary group">
                Learn Our Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits / USP Section ─── */}
      <section className="py-20 bg-sage text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mx-auto mb-4">
                <Leaf size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg tracking-wider mb-3 font-medium uppercase">100% Vegan & Cruelty-Free</h3>
              <p className="font-light text-cream/70 text-sm leading-relaxed">Never tested on animals. Our formulas use only plant-based, ethically sourced ingredients.</p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mx-auto mb-4">
                <Shield size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg tracking-wider mb-3 font-medium uppercase">Sustainable Packaging</h3>
              <p className="font-light text-cream/70 text-sm leading-relaxed">Recyclable glass bottles and minimal waste packaging designed with the earth in mind.</p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg tracking-wider mb-3 font-medium uppercase">Clinically Proven</h3>
              <p className="font-light text-cream/70 text-sm leading-relaxed">Dermatologist-tested formulas that deliver real, visible results backed by science.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-earth mb-2 font-medium">Real Results</p>
            <h2 className="text-3xl md:text-4xl font-light text-slate">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-cream border border-sage/20 p-8 relative">
                <Quote size={28} className="text-sage/30 mb-4" strokeWidth={1} />
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-earth text-earth" />)}
                </div>
                <p className="text-slate/80 font-light leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-sage/20 pt-5">
                  <div className="w-9 h-9 bg-sage rounded-full flex items-center justify-center text-cream font-medium text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate">{t.name}</p>
                    <p className="text-xs text-slate/50">{t.location} · {t.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter Signup Section ─── */}
      <section className="py-20 bg-cream">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-earth mb-3 font-medium">Join the Ritual</p>
          <h2 className="text-3xl font-light text-slate mb-4">Unlock 15% Off Your First Order</h2>
          <p className="text-slate/60 font-light mb-8">
            Subscribe to receive exclusive skincare rituals, limited offers, and early access to new launches.
          </p>
          {subscribed ? (
            <div className="bg-sage/10 border border-sage/30 py-5 px-8">
              <p className="text-primary font-medium tracking-wider">🌿 Thank you for subscribing! Your 15% code is on its way.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-sage/40 bg-white px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button type="submit" className="bg-slate text-cream px-6 py-3 text-xs uppercase tracking-widest hover:bg-primary transition-colors flex-shrink-0">
                Get 15% Off
              </button>
            </form>
          )}
          <p className="text-xs text-slate/30 mt-4 font-light">No spam. Unsubscribe any time. Privacy matters.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
