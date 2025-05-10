import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import replicateRoutes from './routes/replicateRoutes.js';




const app = express();
connectDB(process.env.MONGODB_URL);
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/replicate', replicateRoutes);


app.get('/', async (req, res) => {
  res.send('sucessfully connected ');
  })


const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL)
    app.listen(8080, () => console.log('Server has started pn port http://localhost:8080'))
} catch (error){
    console.log(error);
} }

startServer();