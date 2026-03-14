import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Package, TrendingUp, Upload, Database, ChevronLeft, Trash2 } from 'lucide-react';
import SidekickAI from '../../components/admin/SidekickAI';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ users: 12, orders: 48, revenue: 3840 });
  const [salesData, setSalesData] = useState([
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 550 },
    { name: 'Thu', sales: 480 },
    { name: 'Fri', sales: 700 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 650 },
  ]);

  // Discounts
  const [discounts, setDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({ code: '', type: 'percentage', value: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, discRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/discounts`, { headers: { Authorization: `Bearer ${user.token}` } })
        ]);
        setProducts(prodRes.data);
        setDiscounts(discRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/discounts`, newDiscount, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDiscounts([data, ...discounts]);
      setNewDiscount({ code: '', type: 'percentage', value: '' });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteDiscountHandler = async (id) => {
    if (window.confirm('Delete this discount code?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/discounts/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDiscounts(discounts.filter((d) => d._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/profile" className="text-slate/60 hover:text-primary flex items-center text-sm uppercase tracking-wider transition-colors mb-2">
              <ChevronLeft size={16} className="mr-1" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-light text-slate">Admin Dashboard</h1>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/admin/product/new')} className="bg-slate text-cream px-4 py-2 text-sm uppercase tracking-widest hover:bg-sage flex items-center gap-2 transition-colors">
               <Upload size={16} /> Single Upload
             </button>
             <button onClick={() => navigate('/admin/product/bulk')} className="bg-white border border-slate text-slate px-4 py-2 text-sm uppercase tracking-widest hover:bg-slate/5 flex items-center gap-2 transition-colors">
               <Database size={16} /> Bulk CSV
             </button>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 shadow-sm border border-sage/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 text-sage/20">
               <DollarSign size={100} />
             </div>
             <p className="text-sm uppercase tracking-widest text-slate/60 mb-2 relative z-10">Total Revenue</p>
             <h3 className="text-3xl font-medium text-slate relative z-10">${stats.revenue.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 shadow-sm border border-sage/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 text-sage/20">
               <Package size={100} />
             </div>
             <p className="text-sm uppercase tracking-widest text-slate/60 mb-2 relative z-10">Total Orders</p>
             <h3 className="text-3xl font-medium text-slate relative z-10">{stats.orders}</h3>
          </div>
          <div className="bg-white p-6 shadow-sm border border-sage/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 text-sage/20">
               <Users size={100} />
             </div>
             <p className="text-sm uppercase tracking-widest text-slate/60 mb-2 relative z-10">Total Users</p>
             <h3 className="text-3xl font-medium text-slate relative z-10">{stats.users}</h3>
          </div>
          <div className="bg-white p-6 shadow-sm border border-sage/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 text-sage/20">
               <TrendingUp size={100} />
             </div>
             <p className="text-sm uppercase tracking-widest text-slate/60 mb-2 relative z-10">Conversion Rate</p>
             <h3 className="text-3xl font-medium text-slate relative z-10">3.2%</h3>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white p-8 shadow-sm border border-sage/20 mb-8">
          <h2 className="text-xl font-light text-slate mb-6 uppercase tracking-widest text-center">Sales Overview (7 Days)</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0' }}
                  itemStyle={{ color: '#334155' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#8A9A5B" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Management Section */}
        <div className="bg-white p-8 shadow-sm border border-sage/20 mb-8">
          <h2 className="text-xl font-light text-slate mb-6 uppercase tracking-widest">Manage Products</h2>
          
          {loading ? (
            <p className="text-slate/60">Loading products...</p>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 border border-red-100">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate/5 text-slate/70 uppercase tracking-wider text-xs border-b border-sage/20">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-sage/10 hover:bg-cream/50">
                      <td className="px-4 py-3 text-slate/60 text-xs font-mono">{product._id.substring(0, 8)}...</td>
                      <td className="px-4 py-3 font-medium text-slate">{product.name}</td>
                      <td className="px-4 py-3 text-slate/80">${product.price}</td>
                      <td className="px-4 py-3 text-slate/80">{product.category}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => deleteHandler(product._id, product.name)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Discount Management Section */}
        <div className="bg-white p-8 shadow-sm border border-sage/20 mb-8">
          <h2 className="text-xl font-light text-slate mb-6 uppercase tracking-widest">Manage Discounts</h2>
          
          <form onSubmit={handleCreateDiscount} className="flex flex-wrap gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Code (e.g. SUMMER20)" 
              required
              className="border border-sage/30 px-4 py-2 text-sm uppercase flex-1 min-w-[200px]"
              value={newDiscount.code} 
              onChange={e => setNewDiscount({...newDiscount, code: e.target.value.toUpperCase()})}
            />
            <select 
              className="border border-sage/30 px-4 py-2 text-sm"
              value={newDiscount.type}
              onChange={e => setNewDiscount({...newDiscount, type: e.target.value})}
            >
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount Off</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
            <input 
              type="number" 
              placeholder="Value / Amount" 
              className="border border-sage/30 px-4 py-2 text-sm w-32"
              value={newDiscount.value} 
              onChange={e => setNewDiscount({...newDiscount, value: e.target.value})}
            />
            <button type="submit" className="bg-slate text-cream px-6 py-2 text-sm uppercase tracking-widest hover:bg-earth transition-colors">
              Create Code
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate/5 text-slate/70 uppercase tracking-wider text-xs border-b border-sage/20">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-slate/50 italic">No active discounts</td>
                  </tr>
                ) : (
                  discounts.map((d) => (
                    <tr key={d._id} className="border-b border-sage/10 hover:bg-cream/50">
                      <td className="px-4 py-3 font-medium text-slate">{d.code}</td>
                      <td className="px-4 py-3 text-slate/80 capitalize">{d.type.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-slate/80">
                        {d.type === 'percentage' ? `${d.value}%` : d.type === 'fixed' ? `$${d.value}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => deleteDiscountHandler(d._id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors"
                          title="Delete Discount"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Shopify Sidekick Simulator */}
        <SidekickAI />
      </div>
    </div>
  );
};

export default AdminDashboard;
