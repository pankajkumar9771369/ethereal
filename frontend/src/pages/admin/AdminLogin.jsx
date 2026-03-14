import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split('=')[1] : '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.isAdmin) {
        navigate(redirect);
      } else {
        navigate('/profile');
      }
    }
  }, [navigate, isAuthenticated, user, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // login will set user in context, useEffect will redirect
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-20 px-4 md:px-8">
      <div className="max-w-md mx-auto bg-white p-8 border border-sage/20 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-sage/10 p-4 rounded-full">
            <Lock className="text-primary w-8 h-8" />
          </div>
        </div>
        <h2 className="text-3xl font-light text-slate uppercase tracking-widest text-center mb-2">Admin Portal</h2>
        <p className="text-center text-slate/70 mb-8 text-sm">Sign in to manage Ethereal Skincare</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 border border-red-200 text-sm flex items-center gap-2">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium tracking-wider text-slate uppercase mb-2">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@ethereal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cream/50 border border-sage/30 px-4 py-3 text-slate focus:outline-none focus:border-primary transition-colors focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium tracking-wider text-slate uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream/50 border border-sage/30 px-4 py-3 text-slate focus:outline-none focus:border-primary transition-colors focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate text-cream py-4 uppercase tracking-widest hover:bg-primary hover:text-white transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-sage/20 text-center">
          <Link to="/login" className="text-sm font-medium text-slate hover:text-primary transition-colors uppercase tracking-widest">
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
