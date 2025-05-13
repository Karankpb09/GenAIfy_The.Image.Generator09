import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  try {
    console.log('🌐 Connecting to MongoDB at:', process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect with MongoDB');
    console.error(err);
  }
};

export default connectDB;
