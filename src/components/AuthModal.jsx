import { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      style={{
        alignItems: "flex-start",
        paddingTop: "80px", // ✅ adds consistent top space
        paddingBottom: "80px", // ✅ adds bottom space too
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="hidden md:flex bg-gradient-to-br from-blue-900 to-blue-700 text-white flex-col justify-center items-center text-center p-10">
            <h2 className="text-3xl font-bold mb-2">Welcome to vmrdaplots</h2>
            <p className="text-sm opacity-90 max-w-xs">
              Your journey to finding the perfect property starts here.
            </p>

            <div className="mt-6 space-y-3 text-left w-full max-w-xs">
              {[
                "List your property for free",
                "Connect with genuine buyers",
                "Track your property performance",
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-8 md:p-10 bg-white">
            <div className="w-full max-w-xs">
              {isLogin ? (
                <LoginForm
                  onSwitchToRegister={() => setIsLogin(false)}
                  onClose={onClose}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setIsLogin(true)}
                  onClose={onClose}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
