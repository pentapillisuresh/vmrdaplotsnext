'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const RegisterFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type'); // Get from query params instead of state

  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  useEffect(() => {
    console.log("role::", selectedType);
    setFormData({
      ...formData,
      role: selectedType
    });
  }, [selectedType]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.role) {
      setError('Please select your role (Owner/Agent/Builder)');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await signUp(
        formData?.email, 
        formData?.password, 
        formData?.fullName, 
        formData?.phoneNumber, 
        formData?.role
      );

      if (error) {
        setError(error.message);
      } else if (data?.client) {
        // ✅ Navigate to dashboard after successful signup
        router.push('/vendor/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="bg-black bg-opacity-40 flex flex-col justify-center items-center w-full h-full text-white text-center p-10">
          <h2 className="text-4xl font-bold mb-4">Join vmrdaplots Today</h2>
          <p className="text-lg text-gray-200 max-w-md">
            Create your account to explore properties, connect with agents, and grow your real estate journey.
          </p>
        </div>
      </div>

      {/* Right Side Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-16">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2 text-center">Sign Up</h2>
            <p className="text-gray-600 text-center">
              Join <span className="text-orange-600 font-semibold">vmrdaplots</span> to find your perfect property
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* I am Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am <span style={{ textTransform: 'capitalize' }}>{selectedType || formData.role}</span>
              </label>
              {/* Radio buttons are commented out in original, keeping same */}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Create a password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            By registering, you agree to our{' '}
            <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
              Terms & Conditions
            </a>
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign in link */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login-register')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Wrap with Suspense because useSearchParams requires it in App Router
const RegisterForm = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
};

export default RegisterForm;