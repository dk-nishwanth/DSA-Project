import { AdminLoginForm } from '@/components/auth/admin-login-form';

export default function AdminLogin() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-12">
        <div className="max-w-lg">
          <div className="text-3xl font-bold mb-2">AlgoWave • Admin</div>
          <p className="text-indigo-100 mb-2">
            Ride the wave of algorithms
          </p>
          <p className="text-indigo-100 text-sm">
            Manage classes, monitor student progress, and create assignments — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold">Student Insights</div>
              <div className="text-indigo-100">Track completion and activity in real time.</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold">Assignments</div>
              <div className="text-indigo-100">Create and manage class assignments easily.</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold">Analytics</div>
              <div className="text-indigo-100">Identify struggling students early.</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold">Roles & Access</div>
              <div className="text-indigo-100">Secure access for admins and teachers.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <AdminLoginForm />
      </div>
    </div>
  );
}


