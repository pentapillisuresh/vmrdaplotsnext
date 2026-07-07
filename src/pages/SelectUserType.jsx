'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Users } from 'lucide-react';

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
      // Navigate to register page with selectedType as query parameter
      router.push(`/register?type=${selectedType}`);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 bg-white overflow-y-auto">
          <div className="max-w-lg mx-auto w-full py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Tell us about yourself
              </h1>
              <p className="text-base text-gray-600">
                Select your role to get started
              </p>
            </div>

            {/* User Type Cards */}
            <div className="space-y-3 mb-6">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                      selectedType === type.id
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedType === type.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-0.5">
                        {type.title}
                      </h3>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-500 mt-4">
              You can change your role later in settings
            </p>
          </div>
        </div>

        {/* Right Column: Full Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-gray-900/80 z-10"></div>
          <img
            src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Modern Building"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10 xl:px-14 text-white z-20">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
              Start Your Real Estate Journey
            </h2>
            <p className="text-base xl:text-lg text-gray-200 leading-relaxed max-w-md">
              Join thousands of property owners, agents, and builders who trust our platform to manage their real estate needs.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="text-2xl xl:text-3xl font-bold mb-1">10K+</div>
                <div className="text-xs text-gray-300">Active Users</div>
              </div>
              <div>
                <div className="text-2xl xl:text-3xl font-bold mb-1">500+</div>
                <div className="text-xs text-gray-300">Properties</div>
              </div>
              <div>
                <div className="text-2xl xl:text-3xl font-bold mb-1">98%</div>
                <div className="text-xs text-gray-300">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function SelectUserType() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <SelectUserTypeContent />
    </Suspense>
  );
}