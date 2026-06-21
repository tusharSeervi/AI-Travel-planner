import { MoodScore } from '@/types';

interface Props { moodScore: MoodScore; }

const categories = [
  { key: 'food', label: '🍜 Food', color: 'bg-orange-400' },
  { key: 'culture', label: '🏛️ Culture', color: 'bg-purple-400' },
  { key: 'adventure', label: '🧗 Adventure', color: 'bg-red-400' },
  { key: 'relaxation', label: '🌿 Relaxation', color: 'bg-green-400' },
  { key: 'shopping', label: '🛍️ Shopping', color: 'bg-pink-400' },
] as const;

export default function MoodScoreCard({ moodScore }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Trip Mood Score™</h3>
          <p className="text-sm text-slate-500">Activity balance analysis</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{moodScore.overall}</div>
          <div className="text-xs text-slate-500">/ 100</div>
        </div>
      </div>

      <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg">
        <div className="text-sm font-semibold text-blue-800">{moodScore.label}</div>
        <div className="text-xs text-blue-600 mt-0.5">{moodScore.insight}</div>
      </div>

      <div className="space-y-2.5">
        {categories.map(({ key, label, color }) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>{label}</span>
              <span>{moodScore[key]}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all`}
                style={{ width: `${moodScore[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
