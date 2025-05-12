import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = () => {
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch((err) => {
            console.error('❌ Failed to connect with MongoDB');
            console.error(err);
        });
};

export default connectDB;
