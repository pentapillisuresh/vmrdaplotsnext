'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Phone, Mail, Key, Send, CheckCircle, AlertCircle } from 'lucide-react';
import ApiService from '../hooks/ApiService';
import { sendSMS } from './sendSMS';

const LoginFormContent = ({ onClose }) => {
  const router = useRouter();
  const { signIn } = useAuth();
  
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  
  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // Timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.clear();
  }, []);

  // Handle Email Login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else if (data?.client) {
        const userData = data.client;
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('clientData', JSON.stringify(userData));
        localStorage.setItem('token', data.token || '');
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('profileUpdate', { detail: userData }));
        if (onClose) onClose();
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 1000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setOtpError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.post('/auth/login/phone', { phone: phoneNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        Alert.alert("Error", data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }
console.log("rrr:::",response)
      // Store required data
      // await sendSMS(response.phone, response.otp)
      await localStorage.setItem("phone", response.phone);
      await localStorage.setItem("isNewUser", JSON.stringify(response.isNewUser));
      await localStorage.setItem("otp_expires_at", response.expires_at);

      // ⚠️ OTP should NOT be stored in production (only for testing)
      await localStorage.setItem("otp_debug", response.otp);
      setLoading(false);

      // Navigate to OTP verify screen
      setOtpSent(true);
      setTimer(60);
      setOtpError('OTP sent successfully! Check your phone.');

    } catch (error) {
      setLoading(false);
      setOtpError("Network Error", "Please try again later");
      console.error("OTP API Error:", error.message);
    }
  };

  const verifyOTP = async () => {

    if (!otp || otp.length < 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {

      const response = await ApiService.post('/auth/login/phone/verify',{ phone:phoneNumber, otp: otp });

      if (!response?.success) {
        Alert.alert("Verification Failed", response?.message || "Invalid OTP");
        return;
      }else 

      setOtpVerified(true);
      setOtpError('OTP verified successfully!');
      const userData=response.user
      // Login user with phone number
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('clientData', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('profileUpdate', { detail: userData }));

      setTimeout(() => {
        router.push('/vendor/dashboard');
      }, 1000);

    } catch (error) {
      console.error("Verify OTP Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (timer > 0) return;
    await sendOTP();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-600/60">
          <div className="flex flex-col justify-center items-center w-full h-full text-white text-center p-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md">
              <h2 className="text-4xl font-bold mb-4 font-serif">Welcome to vmrdaplots</h2>
              <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-100 leading-relaxed">
                Find your dream property with the most trusted real estate platform in Vizag.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Trusted by 5000+ clients</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">100% Verified Properties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue to your vmrdaplots account</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => {
                setLoginMethod('email');
                setError('');
                setOtpError('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                loginMethod === 'email'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Login
            </button>
            <button
              onClick={() => {
                setLoginMethod('phone');
                setError('');
                setOtpError('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                loginMethod === 'phone'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone Login
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {otpError && (
            <div className={`border px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
              otpError.includes('successfully') 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {otpError.includes('successfully') ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {otpError}
            </div>
          )}

          {/* Email Login Form */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-10 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Phone OTP Login Form */}
          {loginMethod === 'phone' && (
            <div className="space-y-5">
              {!otpVerified ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          disabled={otpSent}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 ${
                            otpSent ? 'bg-gray-100' : ''
                          }`}
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                        />
                      </div>
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={sendOTP}
                          disabled={otpLoading || phoneNumber.length < 10}
                          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {otpLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                            setOtpError('');
                          }}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter OTP
                        </label>
                        <div className="flex gap-3">
                          <div className="flex-1 relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={otpLoading || otp.length < 6}
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                          >
                            {otpLoading ? 'Verifying...' : <><Send className="w-4 h-4" /> Verify</>}
                          </button>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={resendOTP}
                          disabled={timer > 0}
                          className={`text-sm font-medium transition-colors ${
                            timer > 0 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-orange-500 hover:text-orange-600'
                          }`}
                        >
                          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-700">OTP Verified!</h3>
                  <p className="text-sm text-green-600 mt-1">Redirecting to dashboard...</p>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/select-user-type')}
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Wrap with Suspense because useRouter requires it in App Router
const LoginForm = ({ onClose }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <LoginFormContent onClose={onClose} />
    </Suspense>
  );
};

export default LoginForm;