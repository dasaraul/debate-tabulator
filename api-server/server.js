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

// Enhanced CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://128.199.164.94:3000',
    'http://128.199.164.94',
    'https://debate-tabulator.jawanich.my.id',
    'http://debate-tabulator.jawanich.my.id'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const origin = req.get('Origin') || 'No Origin';
  
  console.log(`${timestamp} - ${method} ${url} - Origin: ${origin}`);
  next();
});

// Security middleware
app.use((req, res, next) => {
  res.header('X-Powered-By', 'Debate Tabulator API');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use('/api/rounds', roundsRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/best-speakers', bestSpeakersRouter);

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await connectToDatabase();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Debate Tabulator API',
    version: '1.0.0',
    description: 'API for British Parliamentary Debate competition management',
    endpoints: {
      '/api/rounds': 'Round management (GET, POST)',
      '/api/rankings': 'Team rankings by Victory Points (GET)',
      '/api/best-speakers': 'Speaker rankings by scores (GET)',
      '/health': 'Health check'
    },
    database: process.env.DATABASE_NAME || 'debate_tabulator',
    author: 'made by Tamaes'
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api/rounds', '/api/rankings', '/api/best-speakers']
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`${timestamp} - API Error:`, err);
  
  // MongoDB specific errors
  if (err.name === 'MongoError' || err.name === 'MongoNetworkError') {
    return res.status(500).json({ 
      error: 'Database Error',
      message: 'Unable to connect to database',
      timestamp 
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      timestamp
    });
  }
  
  // Default error
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    timestamp
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Connect to database and start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(60));
      console.log('🚀 Debate Tabulator API Server Started Successfully!');
      console.log('='.repeat(60));
      console.log(`📡 Port: ${PORT}`);
      console.log(`🗄️ Database: ${process.env.DATABASE_NAME}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⚡ API Base: http://localhost:${PORT}/api`);
      console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
      console.log('='.repeat(60));
      console.log('📝 Available Endpoints:');
      console.log('  POST /api/rounds - Save round data');
      console.log('  GET  /api/rounds - Get all rounds');
      console.log('  GET  /api/rankings - Get team rankings');
      console.log('  GET  /api/best-speakers - Get speaker rankings');
      console.log('='.repeat(60));
    });
  })
  .catch(error => {
    console.error('❌ Failed to start API server:', error);
    console.error('Check your MongoDB connection string and try again.');
    process.exit(1);
  });
