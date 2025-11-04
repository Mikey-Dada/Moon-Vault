import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import Routes
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import budgetRoutes from './routes/budgets.js';

dotenv.config();

const app = express();

// === MIDDLEWARE ===
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Moon Vault API is running!' });
});

// === 404 HANDLER ===
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// === DATABASE & SERVER ===
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    process.exit(0);
  });
});