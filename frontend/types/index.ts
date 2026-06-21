export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  category: 'food' | 'culture' | 'adventure' | 'shopping' | 'relaxation' | 'other';
  estimatedCost: number;
}

export interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

export interface Hotel {
  name: string;
  tier: 'budget' | 'mid-range' | 'luxury';
  pricePerNight: number;
  rating: number;
  highlights: string[];
}

export interface MoodScore {
  food: number;
  adventure: number;
  culture: number;
  relaxation: number;
  shopping: number;
  overall: number;
  label: string;
  insight: string;
}

export interface Trip {
  _id: string;
  destination: string;
  days: number;
  budgetType: 'low' | 'medium' | 'high';
  interests: string[];
  itinerary: Day[];
  budget: BudgetBreakdown;
  hotels: Hotel[];
  moodScore: MoodScore;
  status: 'generating' | 'ready' | 'error';
  createdAt: string;
}
