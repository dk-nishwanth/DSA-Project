import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { AdminLoginForm } from '@/components/auth/admin-login-form';

export default function Login() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background/Visuals */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">DSA</h1>
            <div className="w-64 h-64 mx-auto relative">
              {/* Abstract network graphic */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-sm ${
                      Math.random() > 0.7 
                        ? 'bg-red-600' 
                        : Math.random() > 0.5 
                        ? 'bg-gray-400 border border-gray-300' 
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={i}
                    x1={Math.random() * 256}
                    y1={Math.random() * 256}
                    x2={Math.random() * 256}
                    y2={Math.random() * 256}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {isAdminLogin ? (
            <AdminLoginForm onSwitchToUser={() => setIsAdminLogin(false)} />
          ) : (
            <LoginForm onSwitchToAdmin={() => setIsAdminLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
