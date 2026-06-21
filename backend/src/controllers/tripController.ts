import { Response } from 'express';
import Trip from '../models/Trip';
import { generateItinerary, regenerateDay } from '../services/gemini';
import { AuthRequest } from '../middleware/auth';

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, days, budgetType, interests } = req.body;
    if (!destination || !days || !budgetType) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const trip = await Trip.create({
      userId: req.userId,
      destination,
      days,
      budgetType,
      interests: interests || [],
      status: 'generating',
    });

    res.status(201).json({ trip });

    // Generate in background
    generateItinerary({ destination, days, budgetType, interests })
      .then(async (data) => {
        await Trip.findByIdAndUpdate(trip._id, {
          itinerary: data.itinerary,
          budget: data.budget,
          hotels: data.hotels,
          moodScore: data.moodScore,
          status: 'ready',
        });
      })
      .catch(async () => {
        await Trip.findByIdAndUpdate(trip._id, { status: 'error' });
      });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) { res.status(404).json({ message: 'Trip not found' }); return; }
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!trip) { res.status(404).json({ message: 'Trip not found' }); return; }
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dayIndex, activityIndex, activity } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) { res.status(404).json({ message: 'Trip not found' }); return; }

    if (activity === null) {
      trip.itinerary[dayIndex].activities.splice(activityIndex, 1);
    } else if (activityIndex === -1) {
      trip.itinerary[dayIndex].activities.push(activity);
    } else {
      trip.itinerary[dayIndex].activities[activityIndex] = activity;
    }

    await trip.save();
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const regenerateDayController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dayNumber, instruction } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) { res.status(404).json({ message: 'Trip not found' }); return; }

    const newDay = await regenerateDay(
      { destination: trip.destination, days: trip.days, budgetType: trip.budgetType, interests: trip.interests },
      dayNumber,
      instruction || `Regenerate day ${dayNumber}`
    );

    const dayIdx = trip.itinerary.findIndex(d => d.day === dayNumber);
    if (dayIdx !== -1) trip.itinerary[dayIdx] = newDay;
    else trip.itinerary.push(newDay);

    await trip.save();
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
