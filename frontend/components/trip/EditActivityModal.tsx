'use client';
import { useState } from 'react';
import { Activity } from '@/types';
import { X } from 'lucide-react';

interface Props {
  activity: Activity | null;
  dayIndex: number;
  activityIndex: number;
  onSave: (dayIndex: number, activityIndex: number, activity: Activity | null) => void;
  onClose: () => void;
}

const CATEGORIES = ['food', 'culture', 'adventure', 'shopping', 'relaxation', 'other'] as const;

export default function EditActivityModal({ activity, dayIndex, activityIndex, onSave, onClose }: Props) {
  const [form, setForm] = useState<Activity>(activity || {
    time: '', activity: '', description: '', category: 'other', estimatedCost: 0,
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">{activity ? 'Edit Activity' : 'Add Activity'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Time</label>
            <input className="input" placeholder="e.g. 9:00 AM" value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Activity Name</label>
            <input className="input" placeholder="Activity name" value={form.activity}
              onChange={e => setForm(f => ({ ...f, activity: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Brief description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
              <select className="input" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Activity['category'] }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Est. Cost ($)</label>
              <input className="input" type="number" min={0} value={form.estimatedCost}
                onChange={e => setForm(f => ({ ...f, estimatedCost: Number(e.target.value) }))} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
          {activity && activityIndex !== -1 && (
            <button
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              onClick={() => { onSave(dayIndex, activityIndex, null); onClose(); }}
            >
              Delete
            </button>
          )}
          <button
            className="btn-primary flex-1"
            onClick={() => { if (form.activity.trim()) { onSave(dayIndex, activityIndex, form); onClose(); } }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
