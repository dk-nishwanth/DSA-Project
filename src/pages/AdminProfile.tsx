import { AdminHeader } from '@/components/admin/admin-header';
import { AdminProfile as AdminProfileComponent } from '@/components/admin/admin-profile';

export default function AdminProfile() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 bg-gray-50">
        <AdminProfileComponent />
      </main>
    </div>
  );
}