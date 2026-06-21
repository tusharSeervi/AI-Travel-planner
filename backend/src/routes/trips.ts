import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  createTrip,
  getTrips,
  getTrip,
  deleteTrip,
  updateActivity,
  regenerateDayController,
} from '../controllers/tripController';

const router = Router();
router.use(protect);
router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTrip);
router.delete('/:id', deleteTrip);
router.patch('/:id/activity', updateActivity);
router.post('/:id/regenerate-day', regenerateDayController);

export default router;
