'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

const RegisterFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type');

  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        role: selectedType
      }));
    }
  }, [selectedType]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.role
      );

      if (error) {
        setError(error.message);
      } else if (data?.client) {
        const userData = data.client;
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('clientData', JSON.stringify(userData));
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('userRegistered', 'true');
        localStorage.setItem('userRole', formData.role);
        
        setSuccess('Account created successfully! Redirecting to dashboard...');
        
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('profileUpdate', { detail: userData }));

        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 1500);
      }
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch(formData.role) {
      case 'owner': return <User className="w-5 h-5" />;
      case 'agent': return <User className="w-5 h-5" />;
      case 'builder': return <User className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Left Side - Only Image */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('./images/login1.png')",
          }}
        />

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center">
          <div className="w-full max-w-sm mx-auto space-y-4 min-h-[400px] flex flex-col justify-center">
            {/* Back Button */}
            <button
              onClick={() => router.push('/login-register')}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-sm text-gray-500 mt-1">
                Join <span className="text-orange-600 font-semibold">vmrdaplots</span> to find your perfect property
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-full text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-full text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Role Selection Display */}
              {selectedType && (
                <div className="bg-orange-50 border border-orange-200 rounded-full p-2.5 flex items-center gap-3 px-4">
                  {getRoleIcon()}
                  <div>
                    <p className="text-xs text-gray-500">Registering as</p>
                    <p className="font-semibold text-gray-800 capitalize text-sm">{formData.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/select-user-type')}
                    className="ml-auto text-xs text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-sm text-[#333333] bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-sm text-[#333333] bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-sm text-[#333333] bg-white"
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-[#333333] border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 text-sm bg-white"
                    placeholder="Create a password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs">
              By registering, you agree to our{' '}
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                Terms & Conditions
              </a>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">Already have an account?</span>
              </div>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <button
                onClick={() => router.push('/login-register')}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-2.5 border-2 border-orange-500 hover:bg-orange-500 text-orange-500 hover:text-white font-semibold rounded-full transition-all duration-300 group text-sm"
              >
                <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Sign In
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with Suspense because useSearchParams requires it in App Router
const RegisterForm = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
};

export default RegisterForm;