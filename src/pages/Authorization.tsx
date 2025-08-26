import { useState } from 'react';
import { AuthorizationSystem } from '@/components/auth/authorization-system';
import { useNavigate } from 'react-router-dom';

export default function Authorization() {
  const [showAuthSystem, setShowAuthSystem] = useState(true);
  const navigate = useNavigate();

  const handleAuthorized = () => {
    // Navigate to admin signup page
    navigate('/admin/signup');
  };

  const handleCancel = () => {
    // Navigate back to admin login
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background/Visuals */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">DSA</h1>
            <div className="w-64 h-64 mx-auto relative">
              {/* Code/Programming themed background */}
              <div className="absolute inset-0">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-white/10 font-mono text-xs"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  >
                    {Math.random() > 0.5 ? '01' : '10'}
                  </div>
                ))}
              </div>
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                {Array.from({ length: 15 }).map((_, i) => (
                  <line
                    key={i}
                    x1={Math.random() * 256}
                    y1={Math.random() * 256}
                    x2={Math.random() * 256}
                    y2={Math.random() * 256}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
            <p className="text-white/80 text-lg mt-4">
              Admin Authorization System
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Authorization Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {showAuthSystem && (
            <AuthorizationSystem 
              onAuthorized={handleAuthorized}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
