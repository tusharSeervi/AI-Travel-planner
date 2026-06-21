'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Trip, Activity } from '@/types';
import MoodScoreCard from '@/components/trip/MoodScoreCard';
import BudgetCard from '@/components/trip/BudgetCard';
import HotelCards from '@/components/trip/HotelCards';
import EditActivityModal from '@/components/trip/EditActivityModal';
import RegenerateDayModal from '@/components/trip/RegenerateDayModal';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, RefreshCw, Clock, DollarSign, Loader2 } from 'lucide-react';

const categoryColor: Record<string, string> = {
  food: 'bg-orange-100 text-orange-700',
  culture: 'bg-purple-100 text-purple-700',
  adventure: 'bg-red-100 text-red-700',
  shopping: 'bg-pink-100 text-pink-700',
  relaxation: 'bg-green-100 text-green-700',
  other: 'bg-slate-100 text-slate-600',
};

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ dayIndex: number; activityIndex: number; activity: Activity | null } | null>(null);
  const [regenModal, setRegenModal] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTrip = useCallback(async () => {
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data.trip);
      if (data.trip.status === 'generating') {
        setTimeout(fetchTrip, 3000);
      }
    } catch {
      toast.error('Trip not found');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchTrip(); }, [fetchTrip]);

  const handleActivitySave = async (dayIndex: number, activityIndex: number, activity: Activity | null) => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/trips/${id}/activity`, { dayIndex, activityIndex, activity });
      setTrip(data.trip);
      toast.success(activity === null ? 'Activity removed' : activityIndex === -1 ? 'Activity added' : 'Activity updated');
    } catch {
      toast.error('Failed to update activity');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenDay = async (dayNumber: number, instruction: string) => {
    try {
      const { data } = await api.post(`/trips/${id}/regenerate-day`, { dayNumber, instruction });
      setTrip(data.trip);
      toast.success(`Day ${dayNumber} regenerated!`);
    } catch {
      toast.error('Failed to regenerate day');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  if (!trip) return null;

  if (trip.status === 'generating') return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <div className="text-center">
        <h3 className="font-semibold text-slate-900">Generating your itinerary...</h3>
        <p className="text-sm text-slate-500 mt-1">Our AI is crafting your perfect trip to {trip.destination}</p>
      </div>
    </div>
  );

  if (trip.status === 'error') return (
    <div className="text-center py-16">
      <p className="text-red-500">Failed to generate itinerary. Please try again.</p>
      <button onClick={() => router.push('/trip/new')} className="btn-primary mt-4">Create New Trip</button>
    </div>
  );

  return (
    <div>
      <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{trip.destination}</h1>
        <p className="text-slate-500 mt-1">{trip.days} days · {trip.budgetType} budget · {trip.interests.join(', ')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Itinerary */}
        <div className="lg:col-span-2 space-y-4">
          {trip.itinerary.map((day, dayIndex) => (
            <div key={day.day} className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900">Day {day.day}</span>
                  <span className="text-slate-500 text-sm ml-2">— {day.title}</span>
                </div>
                <button
                  onClick={() => setRegenModal(day.day)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
              </div>

              <div className="p-4 space-y-3">
                {day.activities.map((act, actIndex) => (
                  <div
                    key={actIndex}
                    className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                    onClick={() => setEditModal({ dayIndex, activityIndex: actIndex, activity: act })}
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" /> {act.time}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-900 text-sm">{act.activity}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[act.category] || categoryColor.other}`}>
                          {act.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <DollarSign className="h-3 w-3" />{act.estimatedCost}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setEditModal({ dayIndex, activityIndex: -1, activity: null })}
                  className="w-full py-2 border border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Activity
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {trip.moodScore && <MoodScoreCard moodScore={trip.moodScore} />}
          {trip.budget && <BudgetCard budget={trip.budget} />}
          {trip.hotels?.length > 0 && <HotelCards hotels={trip.hotels} />}
        </div>
      </div>

      {editModal && (
        <EditActivityModal
          activity={editModal.activity}
          dayIndex={editModal.dayIndex}
          activityIndex={editModal.activityIndex}
          onSave={handleActivitySave}
          onClose={() => setEditModal(null)}
        />
      )}

      {regenModal !== null && (
        <RegenerateDayModal
          dayNumber={regenModal}
          onRegenerate={(instr) => handleRegenDay(regenModal, instr)}
          onClose={() => setRegenModal(null)}
        />
      )}

      {saving && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Saving...
        </div>
      )}
    </div>
  );
}
