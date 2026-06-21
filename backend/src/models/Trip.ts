import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  time: string;
  activity: string;
  description: string;
  category: 'food' | 'culture' | 'adventure' | 'shopping' | 'relaxation' | 'other';
  estimatedCost: number;
}

export interface IDay {
  day: number;
  title: string;
  activities: IActivity[];
}

export interface IBudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

export interface IHotel {
  name: string;
  tier: 'budget' | 'mid-range' | 'luxury';
  pricePerNight: number;
  rating: number;
  highlights: string[];
}

export interface IMoodScore {
  food: number;
  adventure: number;
  culture: number;
  relaxation: number;
  shopping: number;
  overall: number;
  label: string;
  insight: string;
}

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  destination: string;
  days: number;
  budgetType: 'low' | 'medium' | 'high';
  interests: string[];
  itinerary: IDay[];
  budget: IBudgetBreakdown;
  hotels: IHotel[];
  moodScore: IMoodScore;
  status: 'generating' | 'ready' | 'error';
}

const ActivitySchema = new Schema<IActivity>({
  time: String,
  activity: String,
  description: String,
  category: { type: String, enum: ['food', 'culture', 'adventure', 'shopping', 'relaxation', 'other'] },
  estimatedCost: Number,
});

const DaySchema = new Schema<IDay>({
  day: Number,
  title: String,
  activities: [ActivitySchema],
});

const TripSchema = new Schema<ITrip>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destination: { type: String, required: true },
  days: { type: Number, required: true },
  budgetType: { type: String, enum: ['low', 'medium', 'high'], required: true },
  interests: [String],
  itinerary: [DaySchema],
  budget: {
    flights: Number,
    accommodation: Number,
    food: Number,
    activities: Number,
    miscellaneous: Number,
    total: Number,
  },
  hotels: [{
    name: String,
    tier: { type: String, enum: ['budget', 'mid-range', 'luxury'] },
    pricePerNight: Number,
    rating: Number,
    highlights: [String],
  }],
  moodScore: {
    food: Number,
    adventure: Number,
    culture: Number,
    relaxation: Number,
    shopping: Number,
    overall: Number,
    label: String,
    insight: String,
  },
  status: { type: String, enum: ['generating', 'ready', 'error'], default: 'generating' },
}, { timestamps: true });

export default mongoose.model<ITrip>('Trip', TripSchema);
