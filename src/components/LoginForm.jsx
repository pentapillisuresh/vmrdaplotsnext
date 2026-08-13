'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Phone, Mail, Key, Send, CheckCircle, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';
import ApiService from '../hooks/ApiService';

const LoginFormContent = ({ onClose }) => {
  const router = useRouter();
  const { signIn } = useAuth();
  
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone');
  
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
      console.log("rrr:::",err.data.message);
      setError(err.data.message);
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
        Alert.alert("Error", response.message || "Failed to send OTP");
        setOtpError(response.message)
        setLoading(false);
        return;
      }

      await localStorage.setItem("phone", response.phone);
      await localStorage.setItem("isNewUser", JSON.stringify(response.isNewUser));
      await localStorage.setItem("otp_expires_at", response.expires_at);
      await localStorage.setItem("otp_debug", response.otp);
      setLoading(false);

      setOtpSent(true);
      setTimer(60);
      setOtpError('OTP sent successfully! Check your phone.');

    } catch (error) {
      setLoading(false);
      setOtpError(error.data.message);
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
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('clientData', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('profileUpdate', { detail: userData }));

      setTimeout(() => {
        router.push('/vendor/dashboard');
      }, 1000);

    } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[480px] sm:min-h-[520px]">
        {/* Left Side - Only Image, No Text, No Overlay */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('./images/login1.png')",
          }}
        />

        {/* Right Side - Login Form with Fixed Min Height */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 lg:p-10 flex items-center">
          <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5 min-h-[350px] sm:min-h-[400px] flex flex-col justify-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back!</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Login to your account to continue</p>
            </div>

            {/* Login Method Tabs - Rounded Full */}
            <div className="flex gap-1.5 sm:gap-2 bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => {
                  setLoginMethod('phone');
                  setError('');
                  setOtpError('');
                  setOtpSent(false);
                  setOtp('');
                }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
                  loginMethod === 'phone'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Login with Phone</span>
                <span className="xs:hidden">Phone</span>
              </button>
              <button
                onClick={() => {
                  setLoginMethod('email');
                  setError('');
                  setOtpError('');
                  setOtpSent(false);
                  setOtp('');
                }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
                  loginMethod === 'email'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Login with Email</span>
                <span className="xs:hidden">Email</span>
              </button>
            </div>

            {/* Error Display - Fixed Height Container */}
            <div className="min-h-[44px] sm:min-h-[52px]">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{error}</span>
                </div>
              )}

              {otpError && (
                <div className={`border px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 ${
                  otpError.includes('successfully') 
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {otpError.includes('successfully') ? (
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{otpError}</span>
                </div>
              )}
            </div>

            {/* Phone Login - Fixed Height Container */}
            {loginMethod === 'phone' && (
              <div className="space-y-3 min-h-[160px] sm:min-h-[180px]">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        disabled={otpSent}
                        className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-xs sm:text-sm ${
                          otpSent ? 'bg-gray-100' : 'bg-white'
                        }`}
                        placeholder="Enter phone number"
                        maxLength={10}
                      />
                    </div>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={otpLoading || phoneNumber.length < 10}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-xs sm:text-sm w-full xs:w-auto"
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
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm w-full xs:w-auto"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-2 animate-fadeIn">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                        Enter OTP
                      </label>
                      <div className="flex flex-col xs:flex-row gap-2">
                        <div className="flex-1 relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-xs sm:text-sm bg-white"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={verifyOTP}
                          disabled={otpLoading || otp.length < 6}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm w-full xs:w-auto"
                        >
                          {otpLoading ? (
                            <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <><Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Verify</>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendOTP}
                        disabled={timer > 0}
                        className={`text-xs sm:text-sm font-medium transition-colors ${
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
              </div>
            )}

            {/* Email Login - Fixed Height Container */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3 min-h-[200px] sm:min-h-[230px]">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 sm:py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-xs sm:text-sm bg-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 sm:py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-8 sm:pr-10 transition-all duration-300 text-xs sm:text-sm bg-white"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs sm:text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-1.5 sm:ml-2 text-gray-500">Remember me</span>
                  </label>
                  <a href="#" className="text-orange-500 hover:text-orange-600 font-medium transition-colors text-xs sm:text-sm">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 sm:py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">OR</span>
              </div>
            </div>

            {/* Register Button - Rounded Full */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                Don't have an account?
              </p>
              <button
                onClick={() => router.push('/select-user-type')}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-orange-500 hover:bg-orange-500 text-orange-500 hover:text-white font-semibold rounded-full transition-all duration-300 group text-xs sm:text-sm"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
                Register Now
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with Suspense because useRouter requires it in App Router
const LoginForm = ({ onClose }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <LoginFormContent onClose={onClose} />
    </Suspense>
  );
};

export default LoginForm;