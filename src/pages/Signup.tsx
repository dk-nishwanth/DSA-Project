import { SignupForm } from '@/components/auth/signup-form';

export default function Signup() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>

      {/* Right Section - Background/Branding */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-pink-400 to-red-400"></div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8">DSA</h1>
            <div className="w-64 h-64 mx-auto relative">
              {/* Geometric pattern */}
              <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-white/20 transform rotate-45"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
