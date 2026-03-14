import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-light text-slate">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate/60">
          Or{' '}
          <Link to="/register" className="font-medium text-slate hover:text-earth transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:px-10">
          {error && <div className="bg-red-50 text-red-500 p-3 mb-4 text-sm border border-red-100">{error}</div>}
          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium text-slate">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-sage/30 placeholder-slate/40 focus:outline-none focus:ring-earth focus:border-earth sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-sage/30 placeholder-slate/40 focus:outline-none focus:ring-earth focus:border-earth sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-slate hover:text-earth">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-cream bg-slate hover:bg-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate tracking-widest uppercase transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-sage/20">
            <Link
              to="/admin-login"
              className="w-full flex justify-center py-2 px-4 border border-sage/50 shadow-sm text-sm font-medium text-slate bg-transparent hover:bg-sage/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate tracking-widest uppercase transition-colors"
            >
              Log in as Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
