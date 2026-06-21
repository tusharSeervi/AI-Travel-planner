'use client';
import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface Props {
  dayNumber: number;
  onRegenerate: (instruction: string) => void;
  onClose: () => void;
}

export default function RegenerateDayModal({ dayNumber, onRegenerate, onClose }: Props) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onRegenerate(instruction || `Regenerate day ${dayNumber} with varied activities`);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Regenerate Day {dayNumber}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <p className="text-sm text-slate-600 mb-3">Optionally add instructions for the AI to guide regeneration.</p>
        <textarea
          className="input resize-none" rows={3}
          placeholder={`e.g. "More outdoor activities" or "Focus on local cuisine and street food"`}
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleSubmit} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>
    </div>
  );
}
