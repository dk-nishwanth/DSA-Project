import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [showTeam, setShowTeam] = useState(false);

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
            <p className="text-white/80 text-lg mt-4">
              Data Structures & Algorithms Learning Platform  
            </p>
           <p className="text-white/80 text-lg mt-4">
  <b>
    Created by{' '}
    <button 
      onClick={() => setShowTeam(!showTeam)}
      className="text-blue-400 hover:underline cursor-pointer focus:outline-none"
    >
      AlgoWave Team
    </button>
  </b>
</p>
{showTeam && (
  <p className="text-white/80 text-base mt-3">
    <a href="https://www.linkedin.com/in/nishwanth-dk/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
      Nishwanth DK
    </a>
    {', '}
    <a href="https://www.linkedin.com/in/amirtha-anand/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
      Amirtha A
    </a>
    {', '}
    <a href="https://www.linkedin.com/in/aswin-k-6a40ab259" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
      Ashwin K
    </a>
    {' & '}
    <a href="https://www.linkedin.com/in/gokulsubramaniyan/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
      Gokul S
    </a>
  </p>
)}
          </div>
        </div>
      </div>

      {/* Right Section - Options */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to AlgoWave</h1>
            <p className="text-lg text-muted-foreground mb-3">
              Ride the wave of algorithms
            </p>
            <p className="text-muted-foreground">
              Choose your role to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Student</CardTitle>
                <CardDescription>
                  Access DSA learning materials, practice problems, and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    • Interactive visualizations<br/>
                    • Step-by-step explanations<br/>
                    • Progress tracking<br/>
                    • Practice problems
                  </div>
                  <Button className="w-full" onClick={() => navigate('/login')}>
                    Get Started as Student
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/login')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Admin/Teacher</CardTitle>
                <CardDescription>
                  Monitor student progress, manage classes, and oversee learning outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    • Student monitoring<br/>
                    • Class management<br/>
                    • Progress analytics<br/>
                    • Performance reports
                  </div>
                  <Button className="w-full" onClick={() => navigate('/admin/login')}>
                    Access Admin Panel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              New to the platform?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/signup')}>
                Create an account
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
