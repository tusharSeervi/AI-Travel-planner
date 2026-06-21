'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Calendar, DollarSign, Heart } from 'lucide-react';

const INTERESTS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Nightlife', 'History', 'Art', 'Relaxation', 'Sports'];

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: '',
    days: 3,
    budgetType: 'medium' as 'low' | 'medium' | 'high',
    interests: [] as string[],
  });

  const toggleInterest = (interest: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination.trim()) { toast.error('Enter a destination'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/trips', form);
      toast.success('Trip created! Generating itinerary...');
      router.push(`/trip/${data.trip._id}`);
    } catch {
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Plan a New Trip</h1>
        <p className="text-slate-500 mt-1">Tell us about your dream destination</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <MapPin className="h-4 w-4 text-blue-500" /> Destination
          </label>
          <input
            className="input"
            placeholder="e.g. Tokyo, Japan"
            value={form.destination}
            onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" /> Number of Days: {form.days}
          </label>
          <input
            type="range" min={1} max={14} value={form.days}
            onChange={e => setForm(f => ({ ...f, days: Number(e.target.value) }))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1 day</span><span>14 days</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            <DollarSign className="h-4 w-4 text-blue-500" /> Budget Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['low', 'medium', 'high'] as const).map(b => (
              <button
                key={b} type="button"
                onClick={() => setForm(f => ({ ...f, budgetType: b }))}
                className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                  form.budgetType === b
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {b === 'low' ? '💚 Budget' : b === 'medium' ? '💛 Mid-Range' : '💜 Luxury'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            <Heart className="h-4 w-4 text-blue-500" /> Interests (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest} type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  form.interests.includes(interest)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? 'Creating...' : '✨ Generate AI Itinerary'}
        </button>
      </form>
    </div>
  );
}
