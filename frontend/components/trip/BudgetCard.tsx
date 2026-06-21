import { BudgetBreakdown } from '@/types';
import { DollarSign } from 'lucide-react';

interface Props { budget: BudgetBreakdown; }

const items = [
  { key: 'flights', label: '✈️ Flights' },
  { key: 'accommodation', label: '🏨 Accommodation' },
  { key: 'food', label: '🍽️ Food' },
  { key: 'activities', label: '🎯 Activities' },
  { key: 'miscellaneous', label: '🎒 Miscellaneous' },
] as const;

export default function BudgetCard({ budget }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-green-500" />
        <h3 className="font-semibold text-slate-900">Budget Estimate</h3>
      </div>
      <div className="space-y-2">
        {items.map(({ key, label }) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-slate-600">{label}</span>
            <span className="font-medium text-slate-900">${budget[key].toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between">
        <span className="font-semibold text-slate-900">Total</span>
        <span className="font-bold text-blue-600 text-lg">${budget.total.toLocaleString()}</span>
      </div>
    </div>
  );
}
