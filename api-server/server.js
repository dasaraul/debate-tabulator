import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb.js';
import roundsRouter from './routes/rounds.js';
import rankingsRouter from './routes/rankings.js';
import bestSpeakersRouter from './routes/best-speakers.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://128.199.164.94:3000', 'https://debate-tabulator.jawanich.my.id'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/rounds', roundsRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/best-speakers', bestSpeakersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Connect to database and start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Debate API server running on port ${PORT}`);
      console.log(`🗄️ Database connected: ${process.env.DATABASE_NAME}`);
      console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api/`);
    });
  })
  .catch(error => {
    console.error('Failed to start API server:', error);
    process.exit(1);
  });
