import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

const RESEND_COOLDOWN = 60;

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const resendHandler = async () => {
    setResendMsg('');
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, { email });
      setResendMsg('✓ A new OTP has been sent to your email.');
      setOtp('');
    } catch (err) {
      setResendMsg('✗ ' + (err.response?.data?.message || 'Failed to resend OTP.'));
      setCanResend(true);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { email, otp, newPassword });
      navigate('/login', { state: { message: 'Password reset successful! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-light text-slate">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate/60 px-4">
          Enter the OTP sent to <span className="font-medium text-slate">{email}</span> and your new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:px-10">
          {error && <div className="bg-red-50 text-red-500 p-3 mb-4 text-sm border border-red-100">{error}</div>}
          {resendMsg && (
            <div className={`p-3 mb-4 text-sm border ${resendMsg.startsWith('✓') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
              {resendMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium text-slate text-center">6-Digit OTP</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="------"
                  className="appearance-none block w-full px-3 py-4 text-center text-2xl tracking-[0.5em] border border-sage/30 placeholder-slate/40 focus:outline-none focus:ring-earth focus:border-earth"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate">New Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-sage/30 placeholder-slate/40 focus:outline-none focus:ring-earth focus:border-earth sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate">Confirm Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-sage/30 placeholder-slate/40 focus:outline-none focus:ring-earth focus:border-earth sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium text-cream bg-slate hover:bg-sage focus:outline-none tracking-widest uppercase transition-colors"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center text-sm text-slate/60">
            {canResend ? (
              <button
                onClick={resendHandler}
                className="font-medium text-slate hover:text-earth transition-colors underline underline-offset-2"
              >
                Resend OTP
              </button>
            ) : (
              <span>
                Resend OTP in <span className="font-medium text-slate">{countdown}s</span>
              </span>
            )}
          </div>
          <div className="mt-3 text-center text-sm text-slate/60">
            <Link to="/forgot-password" className="font-medium text-slate hover:text-earth transition-colors">
              Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
