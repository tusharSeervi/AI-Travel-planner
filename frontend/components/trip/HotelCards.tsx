import { Hotel } from '@/types';
import { Star } from 'lucide-react';

interface Props { hotels: Hotel[]; }

const tierStyle = {
  'budget': 'bg-green-100 text-green-700',
  'mid-range': 'bg-yellow-100 text-yellow-700',
  'luxury': 'bg-purple-100 text-purple-700',
};

const tierIcon = { 'budget': '🏨', 'mid-range': '🏩', 'luxury': '🏰' };

export default function HotelCards({ hotels }: Props) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Recommended Hotels</h3>
      <div className="grid gap-3">
        {hotels.map((hotel, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 hover:border-blue-100 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span>{tierIcon[hotel.tier]}</span>
                  <span className="font-medium text-slate-900 text-sm">{hotel.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${tierStyle[hotel.tier]}`}>
                  {hotel.tier}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">${hotel.pricePerNight}/night</div>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-slate-600">{hotel.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.highlights.map((h, j) => (
                <span key={j} className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded">{h}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
