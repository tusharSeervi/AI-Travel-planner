import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-travel-planner';

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not configured. Create backend/.env or set the environment variable.');
  }
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};
