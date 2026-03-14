import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Star, ShieldCheck, Truck, ChevronLeft, Minus, Plus, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange && onChange(s)}>
        <Star size={22} className={s <= value ? 'fill-earth text-earth' : 'text-slate/20'} strokeWidth={1.5} />
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('idle'); // idle | loading | success | error | duplicate
  const [reviewError, setReviewError] = useState('');

  // Sticky CTA on mobile
  const ctaRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(data);
        setLoading(false);
        // Set SEO Meta
        document.title = data.metaTitle || `${data.name} | Ethereal Skincare`;
        if (data.metaDescription) {
          let metaTag = document.querySelector('meta[name="description"]');
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = "description";
            document.head.appendChild(metaTag);
          }
          metaTag.content = data.metaDescription;
        }
      } catch {
        setProduct({ _id: id, name: 'Ethereal Glow Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', description: 'A deeply hydrating serum.', category: 'Serums', price: 65, comparePrice: 85, countInStock: 25, benefits: ['Deep Hydration', 'Brightening'], volume: '30ml', vendor: 'Ethereal Skincare', shippingInfo: 'Processing: 1-2 days | Delivery: 3-5 days' });
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`)
      .then(({ data }) => setReviews(data))
      .catch(() => {});
  }, [id, reviewStatus]);

  // Sticky bar: show when main add-to-cart button scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const handleAddToCart = () => addToCart(product, qty);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!myComment.trim()) return;
    setReviewStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, { product: id, rating: myRating, comment: myComment }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setReviewStatus('success');
      setMyComment('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      if (msg.includes('already reviewed')) {
        setReviewStatus('duplicate');
      } else {
        setReviewStatus('error');
        setReviewError(msg);
      }
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading) return <div className="h-screen flex items-center justify-center pt-20 text-slate">Loading...</div>;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/shop" className="text-slate/50 hover:text-primary flex items-center text-sm uppercase tracking-wider transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="bg-white p-8 md:p-12 shadow-sm relative">
            {product.comparePrice > product.price && (
              <div className="absolute top-8 left-8 z-10 bg-earth text-cream px-4 py-2 text-sm uppercase tracking-widest">Sale</div>
            )}
            {product.tags?.includes('bestseller') && (
              <div className="absolute top-8 right-8 z-10 bg-sage text-cream px-3 py-1 text-xs uppercase tracking-widest">Bestseller</div>
            )}
            <img src={product.image} alt={product.name} className="w-full h-auto object-contain max-h-[550px]" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs uppercase tracking-widest text-earth font-medium">{product.category}</p>
              {product.vendor && <p className="text-xs text-slate/40">{product.vendor}</p>}
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-slate mb-4">{product.name}</h1>

            {/* Rating summary */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'fill-earth text-earth' : 'text-slate/20'} />)}
                <span className="text-sm text-slate/60">{avgRating} ({reviews.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-medium text-slate">${product.price}</span>
              {product.comparePrice > product.price && (
                <span className="text-lg text-slate/40 line-through">${product.comparePrice}</span>
              )}
              {product.comparePrice > product.price && (
                <span className="text-sm text-earth font-medium">Save ${product.comparePrice - product.price}</span>
              )}
            </div>

            <p className="text-slate/70 font-light leading-relaxed mb-4">{product.description}</p>
            
            {product.shippingInfo && (
              <p className="text-xs text-slate/50 font-light mb-8 flex items-center gap-2">
                <Truck size={14} className="text-sage" /> {product.shippingInfo}
              </p>
            )}

            {/* SKU + Tags */}
            {(product.sku || (product.tags && product.tags.length > 0)) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.sku && <span className="text-xs text-slate/40 font-light">SKU: {product.sku}</span>}
                {product.tags?.map(tag => (
                  <span key={tag} className="text-xs border border-sage/30 text-slate/60 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            )}

            {/* Benefits & Volume */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.volume && (
                <div className="border border-sage/30 p-4 bg-white/50 text-center">
                  <p className="text-xs uppercase tracking-widest text-slate/60 mb-1">Volume</p>
                  <p className="font-medium text-slate">{product.volume}</p>
                </div>
              )}
              {product.benefits?.length > 0 && (
                <div className="border border-sage/30 p-4 bg-white/50 text-center">
                  <p className="text-xs uppercase tracking-widest text-slate/60 mb-1">Key Benefits</p>
                <p className="font-medium text-slate text-sm">{product.benefits.slice(0,2).join(' · ')}</p>
                </div>
              )}
            </div>

            {/* Variant Selector */}
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-widest text-slate/60 mb-3">Size</label>
              <div className="flex gap-4">
                <button className="flex-1 py-3 border-2 border-slate text-slate text-sm font-medium tracking-wider uppercase transition-colors">
                  Standard Design
                </button>
                <button className="flex-1 py-3 border-2 border-sage/20 text-slate/50 hover:border-slate/50 text-sm font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2">
                  Jumbo Set <span className="text-xs font-light tracking-normal lowercase">(+$35)</span>
                </button>
              </div>
            </div>

            <div className="border-t border-sage/30 pt-8 mb-8" ref={ctaRef}>
              <div className="flex flex-col sm:flex-row items-stretch gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Quantity</label>
                  <div className="flex items-center border border-slate/30 h-14 w-full sm:w-32">
                    <button className="px-4 text-slate hover:bg-sage/10 h-full transition-colors flex items-center justify-center" onClick={() => setQty(Math.max(1, qty - 1))}>
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-medium">{qty}</span>
                    <button className="px-4 text-slate hover:bg-sage/10 h-full transition-colors flex items-center justify-center" onClick={() => setQty(qty < product.countInStock ? qty + 1 : qty)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 flex items-center justify-center gap-3 h-14 uppercase tracking-widest text-sm transition-all duration-300 ${product.countInStock === 0 ? 'bg-slate/30 text-cream cursor-not-allowed' : 'bg-slate text-cream hover:bg-earth'}`}
                >
                  <ShoppingBag size={18} />
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-sm font-light text-slate/70 border-t border-sage/30 pt-6">
              <div className="flex items-center gap-3"><Truck className="text-earth flex-shrink-0" size={22} strokeWidth={1.5} /><span>Free Shipping over $50</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="text-earth flex-shrink-0" size={22} strokeWidth={1.5} /><span>30-Day Guarantee</span></div>
            </div>
          </div>
        </div>

        {/* ─── Reviews Section ─── */}
        <div className="mt-20 border-t border-sage/20 pt-16">
          <h2 className="text-2xl font-light text-slate mb-10 uppercase tracking-widest">
            Customer Reviews {avgRating && <span className="text-lg text-slate/40 ml-2">★ {avgRating}</span>}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Write Review */}
            <div className="bg-white border border-sage/20 p-8 shadow-sm h-fit">
              <h3 className="text-base font-medium text-slate uppercase tracking-wider mb-5">Write a Review</h3>
              {!user ? (
                <p className="text-sm text-slate/60 font-light">
                  <Link to="/login" className="text-primary underline">Sign in</Link> to leave a review.
                </p>
              ) : reviewStatus === 'success' ? (
                <div className="text-center py-4">
                  <p className="text-green-600 font-medium">Review submitted! Thank you.</p>
                </div>
              ) : reviewStatus === 'duplicate' ? (
                <p className="text-sm text-slate/60 font-light">You've already reviewed this product.</p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Your Rating</label>
                    <StarRating value={myRating} onChange={setMyRating} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Your Review</label>
                    <textarea
                      value={myComment}
                      onChange={e => setMyComment(e.target.value)}
                      required
                      rows={4}
                      placeholder="Share your experience with this product..."
                      className="w-full border border-sage/30 px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors resize-none bg-cream/30"
                    />
                  </div>
                  {reviewStatus === 'error' && <p className="text-red-500 text-xs">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={reviewStatus === 'loading'}
                    className="w-full bg-slate text-cream py-3 text-xs uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Send size={14} /> {reviewStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-5">
              {reviews.length === 0 ? (
                <div className="bg-white border border-sage/20 p-10 text-center">
                  <Star size={36} className="text-slate/15 mx-auto mb-3" />
                  <p className="text-slate/50 font-light">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r._id} className="bg-white border border-sage/20 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sage rounded-full flex items-center justify-center text-cream font-medium text-sm flex-shrink-0">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate text-sm">{r.name}</p>
                          <p className="text-xs text-slate/40">{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= r.rating ? 'fill-earth text-earth' : 'text-slate/15'} />)}
                      </div>
                    </div>
                    <p className="text-slate/80 font-light text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sticky Add-to-Cart (mobile) ─── */}
      {showSticky && product.countInStock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-sage/20 shadow-2xl px-4 py-3 flex items-center gap-4 sm:hidden">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate truncate">{product.name}</p>
            <p className="text-sm text-earth font-medium">${product.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 bg-slate text-cream px-6 py-3 text-xs uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2"
          >
            <ShoppingBag size={15} /> Add to Bag
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
