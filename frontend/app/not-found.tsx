import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
        <p className="text-slate-600 mb-6">Page not found</p>
        <Link href="/dashboard" className="btn-primary inline-block">Go to Dashboard</Link>
      </div>
    </div>
  );
}
