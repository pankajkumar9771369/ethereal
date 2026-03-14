import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package, User as UserIcon, Settings } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white p-6 shadow-sm border border-sage/20">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center text-cream font-medium text-lg">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h2 className="font-medium text-slate">{user.name}</h2>
                   <p className="text-sm text-slate/60">{user.email}</p>
                 </div>
               </div>
               
               <nav className="space-y-2">
                 <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-sage/10 text-primary border-l-2 border-primary text-left">
                   <Package size={18} /> My Orders
                 </button>
                 <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate/70 hover:bg-slate/5 hover:text-slate transition-colors text-left">
                   <UserIcon size={18} /> Account Details
                 </button>
                 {user.isAdmin && (
                   <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate/70 hover:bg-slate/5 hover:text-slate transition-colors text-left border-t border-sage/20 mt-2 pt-4">
                     <Settings size={18} /> Admin Dashboard
                   </button>
                 )}
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                 >
                   <LogOut size={18} /> Sign Out
                 </button>
               </nav>
             </div>
          </div>

          {/* Main Content: Orders */}
          <div className="flex-1">
            <h1 className="text-2xl font-light text-slate mb-6">
              {user.isAdmin ? 'Admin Portal' : 'Order History'}
            </h1>
            
            {user.isAdmin ? (
               <div className="bg-white p-12 text-center shadow-sm border border-sage/20">
                 <Settings size={48} className="mx-auto text-slate/20 mb-4" strokeWidth={1} />
                 <h3 className="text-lg font-medium text-slate mb-2">Administrator Account</h3>
                 <p className="text-slate/60 mb-6 font-light">Shopping features like carts and order histories are disabled for admin accounts.</p>
                 <button onClick={() => navigate('/admin')} className="bg-slate text-cream px-6 py-2 text-sm uppercase tracking-widest hover:bg-sage transition-colors">
                   Go to Dashboard
                 </button>
               </div>
            ) : loading ? (
              <div className="text-slate/60 text-sm">Loading orders...</div>
            ) : orders.length === 0 ? (
               <div className="bg-white p-12 text-center shadow-sm border border-sage/20">
                 <Package size={48} className="mx-auto text-slate/20 mb-4" strokeWidth={1} />
                 <h3 className="text-lg font-medium text-slate mb-2">No orders yet</h3>
                 <p className="text-slate/60 mb-6 font-light">When you place an order, it will appear here.</p>
                 <button onClick={() => navigate('/shop')} className="bg-slate text-cream px-6 py-2 text-sm uppercase tracking-widest hover:bg-sage transition-colors">
                   Start Shopping
                 </button>
               </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white shadow-sm border border-sage/20 overflow-hidden">
                    <div className="bg-slate/5 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-sage/20">
                      <div>
                        <p className="text-xs text-slate/60 uppercase tracking-widest mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-slate">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate/60 uppercase tracking-widest mb-1">Total</p>
                         <p className="text-sm font-medium text-slate">${order.totalPrice.toFixed(2)}</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate/60 uppercase tracking-widest mb-1">Order #</p>
                         <p className="text-sm font-medium text-slate">{order._id.substring(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-green-500' : 'bg-earth'}`}></div>
                        <h3 className="font-medium text-slate">
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </h3>
                        <Link
                          to={`/order/${order._id}`}
                          className="ml-auto text-xs uppercase tracking-widest text-slate/60 hover:text-earth border border-sage/40 px-3 py-1 hover:border-earth transition-colors"
                        >
                          Track Order
                        </Link>
                      </div>
                      
                      <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-16 h-16 bg-cream flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <p className="text-sm font-medium text-slate hover:text-earth cursor-pointer" onClick={() => navigate(`/product/${item.product}`)}>
                                 {item.name}
                               </p>
                               <p className="text-xs text-slate/60 mt-1">Qty: {item.qty} | ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
