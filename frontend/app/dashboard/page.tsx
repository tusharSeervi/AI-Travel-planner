'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import { Trip } from '@/types';
import { MapPin, Calendar, Trash2, Plus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const statusIcon = {
  generating: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
  ready: <CheckCircle className="h-4 w-4 text-green-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const budgetBadge = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-purple-100 text-purple-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/trips');
      setTrips(data.trips);
    } catch {
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // Poll for generating trips
    const interval = setInterval(() => {
      if (trips.some(t => t.status === 'generating')) fetchTrips();
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTrip = async (id: string) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(t => t.filter(tr => tr._id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-slate-500 mt-1">Your AI-powered travel plans</p>
      </div>

      {trips.length === 0 ? (
        <div className="card p-16 text-center">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No trips yet</h3>
          <p className="text-slate-500 mb-6">Create your first AI-powered travel itinerary</p>
          <Link href="/trip/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map(trip => (
            <div key={trip._id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <h3 className="font-semibold text-slate-900 truncate">{trip.destination}</h3>
                  </div>
                  {statusIcon[trip.status]}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Calendar className="h-3.5 w-3.5" />
                    {trip.days} days
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${budgetBadge[trip.budgetType]}`}>
                    {trip.budgetType}
                  </span>
                </div>

                {trip.moodScore && (
                  <div className="mb-3 px-3 py-2 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-700">Mood Score: {trip.moodScore.overall}/100</div>
                    <div className="text-xs text-blue-600">{trip.moodScore.label}</div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {trip.status === 'ready' ? (
                    <Link href={`/trip/${trip._id}`} className="btn-primary flex-1 text-center text-sm py-1.5">
                      View Itinerary
                    </Link>
                  ) : trip.status === 'generating' ? (
                    <div className="flex-1 text-center text-sm text-slate-500 py-1.5">Generating...</div>
                  ) : (
                    <div className="flex-1 text-center text-sm text-red-500 py-1.5">Generation failed</div>
                  )}
                  <button onClick={() => deleteTrip(trip._id)} className="btn-secondary p-1.5">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
