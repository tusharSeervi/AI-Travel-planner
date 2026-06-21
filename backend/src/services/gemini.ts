import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY && !GEMINI_API_KEY.includes('your_')
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

if (!genAI) {
  console.warn('GEMINI_API_KEY is not configured or is a placeholder. Using local fallback itinerary generator.');
}

export interface TripInput {
  destination: string;
  days: number;
  budgetType: 'low' | 'medium' | 'high';
  interests: string[];
}

const parseJsonResponse = (text: string) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Invalid AI response: ${text.slice(0, 300)}`);
  }
  return JSON.parse(jsonMatch[0]);
};

const createFallbackItinerary = (input: TripInput) => {
  const dayActivities = (day: number) => [
    {
      time: '9:00 AM',
      activity: `Explore ${input.destination} landmarks`,
      description: `Start your day with a guided tour of popular spots in ${input.destination}.`,
      category: 'culture',
      estimatedCost: 30,
    },
    {
      time: '12:30 PM',
      activity: `Local lunch experience`,
      description: `Enjoy a meal at a recommended local restaurant.`,
      category: 'food',
      estimatedCost: 25,
    },
    {
      time: '3:00 PM',
      activity: `Afternoon activity`,
      description: `Relax or explore based on your interests.`,
      category: input.interests.includes('Adventure') ? 'adventure' : 'relaxation',
      estimatedCost: 20,
    },
    {
      time: '7:00 PM',
      activity: `Evening highlights`,
      description: `Finish with a memorable evening experience.`,
      category: 'culture',
      estimatedCost: 40,
    },
  ];

  const budgetMultiplier = input.budgetType === 'low' ? 0.8 : input.budgetType === 'high' ? 1.4 : 1;
  const baseFlight = 300;
  const baseHotel = 100 * input.days;
  const totalBudget = Math.round((baseFlight + baseHotel + 50 * input.days) * budgetMultiplier);

  return {
    itinerary: Array.from({ length: input.days }, (_, idx) => ({
      day: idx + 1,
      title: `${input.destination} Day ${idx + 1}`,
      activities: dayActivities(idx + 1),
    })),
    budget: {
      flights: Math.round(baseFlight * budgetMultiplier),
      accommodation: Math.round(baseHotel * budgetMultiplier),
      food: Math.round(50 * input.days * budgetMultiplier),
      activities: Math.round(40 * input.days * budgetMultiplier),
      miscellaneous: Math.round(30 * input.days * budgetMultiplier),
      total: totalBudget,
    },
    hotels: [
      {
        name: `${input.destination} Budget Hotel`,
        tier: 'budget',
        pricePerNight: Math.round(60 * budgetMultiplier),
        rating: 3.5,
        highlights: ['Free WiFi', 'Good location'],
      },
      {
        name: `${input.destination} Mid-Range Hotel`,
        tier: 'mid-range',
        pricePerNight: Math.round(120 * budgetMultiplier),
        rating: 4.0,
        highlights: ['Breakfast included', 'Comfortable rooms'],
      },
      {
        name: `${input.destination} Luxury Hotel`,
        tier: 'luxury',
        pricePerNight: Math.round(220 * budgetMultiplier),
        rating: 4.7,
        highlights: ['Spa', 'Fine dining'],
      },
    ],
    moodScore: {
      food: input.interests.includes('Food') ? 85 : 70,
      adventure: input.interests.includes('Adventure') ? 80 : 55,
      culture: input.interests.includes('Culture') ? 80 : 60,
      relaxation: input.interests.includes('Relaxation') ? 80 : 60,
      shopping: input.interests.includes('Shopping') ? 75 : 50,
      overall: 75,
      label: 'Balanced Experience',
      insight: `A ${input.budgetType} trip with a mix of activities tailored toward your interests.`,
    },
  };
};

const createFallbackDay = (input: TripInput, dayNumber: number, instruction: string) => ({
  day: dayNumber,
  title: `Regenerated Day ${dayNumber}`,
  activities: [
    {
      time: '9:00 AM',
      activity: `Start with ${input.destination} insights`,
      description: `A refreshed morning based on your instruction: ${instruction}.`,
      category: 'culture',
      estimatedCost: 20,
    },
    {
      time: '1:00 PM',
      activity: 'Local meal and leisure',
      description: 'Enjoy a relaxed lunch and explore the area.',
      category: 'food',
      estimatedCost: 30,
    },
    {
      time: '4:00 PM',
      activity: 'Afternoon activity',
      description: 'A new activity to vary your itinerary.',
      category: 'adventure',
      estimatedCost: 25,
    },
  ],
});

export const generateItinerary = async (input: TripInput) => {
  if (!genAI) {
    return createFallbackItinerary(input);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a detailed ${input.days}-day travel itinerary for ${input.destination}.
Budget: ${input.budgetType}. Interests: ${input.interests.join(', ')}.

Return ONLY valid JSON in this exact format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day theme",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Brief description",
          "category": "culture|food|adventure|shopping|relaxation|other",
          "estimatedCost": 25
        }
      ]
    }
  ],
  "budget": {
    "flights": 400,
    "accommodation": 300,
    "food": 150,
    "activities": 100,
    "miscellaneous": 50,
    "total": 1000
  },
  "hotels": [
    {
      "name": "Hotel Name",
      "tier": "budget|mid-range|luxury",
      "pricePerNight": 80,
      "rating": 4.2,
      "highlights": ["Free WiFi", "Central location"]
    }
  ],
  "moodScore": {
    "food": 70,
    "adventure": 60,
    "culture": 80,
    "relaxation": 50,
    "shopping": 40,
    "overall": 72,
    "label": "Culturally Rich",
    "insight": "This trip is heavy on culture and food with moderate adventure."
  }
}

Provide exactly 3 hotels (one per tier). Budget values in USD. Mood scores 0-100. Generate ${input.days} days of activities.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJsonResponse(text);
  } catch (err) {
    console.error('AI itinerary generation failed, using fallback itinerary', err);
    return createFallbackItinerary(input);
  }
};

export const regenerateDay = async (input: TripInput, dayNumber: number, instruction: string) => {
  if (!genAI) {
    return createFallbackDay(input, dayNumber, instruction);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Regenerate day ${dayNumber} itinerary for ${input.destination}.
Budget: ${input.budgetType}. Interests: ${input.interests.join(', ')}.
Special instruction: ${instruction}

Return ONLY valid JSON:
{
  "day": ${dayNumber},
  "title": "Day theme",
  "activities": [
    {
      "time": "9:00 AM",
      "activity": "Activity name",
      "description": "Brief description",
      "category": "culture|food|adventure|shopping|relaxation|other",
      "estimatedCost": 25
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJsonResponse(text);
  } catch (err) {
    console.error('AI regenerate day failed, using fallback day', err);
    return createFallbackDay(input, dayNumber, instruction);
  }
};
