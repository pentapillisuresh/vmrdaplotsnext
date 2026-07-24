'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Users, ArrowRight } from 'lucide-react';

function SelectUserTypeContent() {
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const userTypes = [
    { id: 'owner', title: 'Owner', description: 'I own the property', icon: User },
    { id: 'agent', title: 'Agent', description: 'I am a real estate agent', icon: Users },
    { id: 'builder', title: 'Builder', description: 'I am a builder/developer', icon: Building2 },
  ];

  const handleContinue = async () => {
    if (!selectedType) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push(`/register?type=${selectedType}`);
    }, 1000);
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

        {/* Right Side - Select User Type Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center">
          <div className="w-full max-w-sm mx-auto space-y-5 min-h-[400px] flex flex-col justify-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
              <p className="text-sm text-gray-500 mt-1">Select your role to get started</p>
            </div>

            {/* User Type Cards */}
            <div className="space-y-3">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full p-3.5 rounded-full border-2 transition-all duration-300 flex items-center gap-3 ${
                      selectedType === type.id
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        selectedType === type.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {type.title}
                      </h3>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      selectedType === type.id
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedType === type.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedType || loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Please wait...
                </div>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-400">
              You can change your role later in settings
            </p>

            {/* Already have an account? */}
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
                <User className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function SelectUserType() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <SelectUserTypeContent />
    </Suspense>
  );
}