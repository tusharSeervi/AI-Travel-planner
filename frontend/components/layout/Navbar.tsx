'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Plane, LogOut, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Plane className="h-4 w-4 text-white" />
          </div>
          TravelAI
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
            <Link href="/trip/new" className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
              <Plus className="h-4 w-4" /> New Trip
            </Link>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
