import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      // Always show success (backend doesn't reveal if user exists)
      setMessage('If an account exists for this email, an OTP has been sent.');
      // Navigate to reset-password page after a short delay
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-light text-slate">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-slate/60">
          Enter your email and we'll send you a one-time code to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:px-10">
          {error && <div className="bg-red-50 text-red-500 p-3 mb-4 text-sm border border-red-100">{error}</div>}
          {message && <div className="bg-green-50 text-green-600 p-3 mb-4 text-sm border border-green-100">{message}</div>}

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
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-cream bg-slate hover:bg-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate tracking-widest uppercase transition-colors"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate/60">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-slate hover:text-earth transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
