import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Only start the server if we're not running tests
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;