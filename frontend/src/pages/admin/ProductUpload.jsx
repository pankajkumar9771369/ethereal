import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

const ProductUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    comparePrice: '',
    image: '',
    category: '',
    countInStock: '',
    description: '',
    volume: '',
    benefits: '', // Will split by comma
    sku: '',
    vendor: 'Ethereal Skincare',
    tags: '', // Will split by comma
    shippingInfo: 'Processing: 1-2 days | Delivery: 3-5 days',
    metaTitle: '',
    metaDescription: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        countInStock: Number(formData.countInStock),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        sku: formData.sku || null,
        vendor: formData.vendor || 'Ethereal Skincare',
        shippingInfo: formData.shippingInfo || 'Processing: 1-2 days | Delivery: 3-5 days',
        metaTitle: formData.metaTitle || formData.name,
        metaDescription: formData.metaDescription || '',
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess('Product uploaded successfully!');
      setFormData({
        name: '', price: '', comparePrice: '', image: '', category: '', countInStock: '', description: '', volume: '', benefits: '', sku: '', vendor: 'Ethereal Skincare', tags: '', shippingInfo: 'Processing: 1-2 days | Delivery: 3-5 days', metaTitle: '', metaDescription: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/admin" className="text-slate/60 hover:text-primary flex items-center text-sm uppercase tracking-wider transition-colors mb-4">
            <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-light text-slate">Single Product Upload</h1>
          <p className="text-slate/60 mt-2">Add a new premium item to the catalog.</p>
        </div>

        <div className="bg-white p-8 shadow-sm border border-sage/20">
          {error && <div className="bg-red-50 text-red-500 p-4 mb-6 border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-4 mb-6 border border-green-100">{success}</div>}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate mb-1">Product Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-1">Category</label>
                <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="e.g. Serums, Cleansers" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Price ($)</label>
                 <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Compare Price ($)</label>
                 <input type="number" name="comparePrice" min="0" step="0.01" value={formData.comparePrice} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Stock Count</label>
                 <input type="number" name="countInStock" required min="0" value={formData.countInStock} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">Image URL</label>
              <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="https://images.unsplash.com/..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Volume (e.g. 50ml)</label>
                 <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Benefits (Comma separated)</label>
                 <input type="text" name="benefits" value={formData.benefits} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="Hydration, Anti-aging" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">SKU</label>
                 <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="e.g. ETH-SER-01" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Vendor</label>
                 <input type="text" name="vendor" value={formData.vendor} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate mb-1">Tags (Comma separated)</label>
                 <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="bestseller, seasonal, vegan" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">Shipping Info Snippet</label>
              <input type="text" name="shippingInfo" value={formData.shippingInfo} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" />
            </div>

            <div className="pt-4 border-t border-sage/20">
              <h3 className="text-lg font-light text-slate mb-4">SEO Optimization</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="Leave blank to use product name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">Meta Description</label>
                  <textarea name="metaDescription" rows="2" value={formData.metaDescription} onChange={handleChange} className="w-full px-4 py-2 border border-sage/30 focus:outline-none focus:border-earth bg-cream/50" placeholder="Brief SEO description for search engines"></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sage/20">
              <button type="submit" disabled={loading} className="w-full bg-slate text-cream py-4 uppercase tracking-widest text-sm hover:bg-sage transition-colors">
                 {loading ? 'Uploading...' : 'Publish Product'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ProductUpload;
