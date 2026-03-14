import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RESEND_COOLDOWN = 60; // seconds

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const { verifyOtp, resendOtp, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email passed from Register or ForgotPassword via router state
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await verifyOtp(email, otp);
    if (result.success) {
      navigate('/');
    }
  };

  const resendHandler = async () => {
    setResendMsg('');
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    const result = await resendOtp(email);
    if (result.success) {
      setResendMsg('✓ A new OTP has been sent to your email.');
      setOtp('');
    } else {
      setResendMsg('✗ ' + (result.error || 'Failed to resend OTP.'));
      setCanResend(true);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-light text-slate">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-slate/60 px-4">
          We've sent a 6-digit OTP to <span className="font-medium text-slate">{email}</span>.
          The code expires in 10 minutes.
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
                  className="appearance-none block w-full px-3 py-4 text-center text-2xl tracking-[0.5em] border border-sage/30 placeholder-slate/40 focus:outline-none focus:ring-earth focus:border-earth"
                  placeholder="------"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium text-cream bg-slate hover:bg-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate tracking-widest uppercase transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </div>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center text-sm text-slate/60">
            {canResend ? (
              <button
                onClick={resendHandler}
                disabled={loading}
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
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
