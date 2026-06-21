# AI Travel Planner

An AI-powered travel itinerary generator built with Next.js, Node.js, MongoDB, and Google Gemini.

## Tech Stack

| Layer | Tech | Reason |
|-------|------|--------|
| Frontend | Next.js 15 + TypeScript | App Router, SSR, type safety |
| Styling | Tailwind CSS | Rapid UI development |
| Backend | Node.js + Express | Lightweight, fast API |
| Database | MongoDB + Mongoose | Flexible schema for itinerary data |
| Auth | JWT (7-day tokens) | Stateless, scalable |
| AI | Google Gemini 1.5 Flash | Fast, cost-effective, high quality |

## Features

- **Auth**: Register/login with JWT. All routes are protected.
- **AI Itinerary**: Gemini generates day-by-day plans based on destination, duration, budget, and interests.
- **Budget Estimation**: AI estimates flights, accommodation, food, activities.
- **Editable Itinerary**: Add, edit, or remove activities per day. Regenerate any day with custom instructions.
- **Hotel Suggestions**: AI suggests 3 hotels (budget, mid-range, luxury) per trip.
- **Trip Mood Score™** *(Creative Feature)*: Analyzes activity categories across the itinerary and outputs a balance score (0-100) across food, culture, adventure, relaxation, and shopping — with an AI-generated insight label. Helps travelers understand if their trip is too activity-heavy or too relaxed before they travel.

## Architecture

```
frontend/          → Next.js 15 App Router
  app/
    auth/          → Login/register pages
    dashboard/     → User's trips list
    trip/[id]/     → Trip detail + itinerary editor
  components/
    layout/        → Navbar
    trip/          → MoodScore, Budget, Hotels, Modals
  lib/             → API client, Auth context

backend/
  src/
    models/        → User, Trip (Mongoose)
    controllers/   → authController, tripController
    routes/        → /auth, /trips
    middleware/    → JWT protect
    services/      → Gemini API wrapper
    config/        → MongoDB connection
```

## Auth Approach

JWT tokens issued on login/register, stored in localStorage, attached as `Authorization: Bearer <token>` header. Server-side middleware validates token on every protected route. MongoDB queries always include `userId: req.userId` for strict data isolation.

## AI Agent Design

The Gemini service (`backend/src/services/gemini.ts`) uses structured JSON prompts to ensure deterministic output. Two functions:
- `generateItinerary()` — full trip: itinerary + budget + hotels + mood score
- `regenerateDay()` — single day with custom instructions

Background generation: the trip document is created immediately (status: `generating`) and the AI runs async. The frontend polls every 3 seconds.

## Creative Feature: Trip Mood Score™

**Problem**: Travelers often end up with poorly balanced trips — too many museums and no downtime, or too much shopping and no local culture. They only realize this after the trip.

**Solution**: The Mood Score analyzes every activity's category (food/culture/adventure/relaxation/shopping) and generates a percentage breakdown + an overall score + a human-readable label ("Culturally Rich", "Adventure Heavy", etc.) with a personalized insight. Users can adjust their itinerary to improve balance before traveling.

## Local Setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev

# Frontend  
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Deployment

**Backend → Render**
1. Connect GitHub repo to Render
2. Root dir: `backend`, build: `npm install && npm run build`, start: `npm start`
3. Add env vars: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, FRONTEND_URL

**Frontend → Vercel**
1. Connect GitHub repo to Vercel
2. Root dir: `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com/api`

## Environment Variables

### Backend
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=random_long_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

## Known Limitations

- Gemini generation takes 5-15 seconds; trip uses polling to check status
- Budget estimates are AI approximations, not real prices
- No real hotel booking integration (AI-suggested names only)
- No image support for destinations
