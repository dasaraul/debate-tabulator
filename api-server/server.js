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

// Enhanced CORS configuration for HTTPS production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://128.199.164.94:3000',
    'http://128.199.164.94:8080',
    'http://debate-tabulator.jawanich.my.id',
    'http://debate-tabulator.jawanich.my.id:8080',
    'https://debate-tabulator.jawanich.my.id'
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
  const proto = req.get('X-Forwarded-Proto') || req.protocol;
  
  console.log(`${timestamp} - ${method} ${url} - Origin: ${origin} - Proto: ${proto}`);
  next();
});

// Security middleware
app.use((req, res, next) => {
  res.header('X-Powered-By', 'Debate Tabulator API v1.0.0');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use('/api/rounds', roundsRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/best-speakers', bestSpeakersRouter);

// Health check endpoint with enhanced info
app.get('/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      ssl: req.get('X-Forwarded-Proto') === 'https' ? 'Enabled' : 'Direct',
      server: 'Express.js + MongoDB'
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
    description: 'British Parliamentary Debate competition management system',
    endpoints: {
      '/api/rounds': 'Round management (GET, POST)',
      '/api/rankings': 'Team rankings by Victory Points (GET)',
      '/api/best-speakers': 'Speaker rankings by scores (GET)',
      '/health': 'Health check and system status'
    },
    database: process.env.DATABASE_NAME || 'debate_tabulator',
    features: ['SSL Support', 'CORS Enabled', 'Real-time Updates'],
    author: 'made by Tamaes'
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api/rounds', '/api/rankings', '/api/best-speakers', '/health']
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`${timestamp} - API Error:`, err);
  
  if (err.name === 'MongoError' || err.name === 'MongoNetworkError') {
    return res.status(500).json({ 
      error: 'Database Error',
      message: 'Unable to connect to database',
      timestamp 
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      timestamp
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    timestamp
  });
});

// Connect to database and start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(60));
      console.log('🚀 Debate Tabulator API Server - PRODUCTION');
      console.log('='.repeat(60));
      console.log(`📡 Port: ${PORT}`);
      console.log(`🗄️ Database: ${process.env.DATABASE_NAME}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 HTTPS Support: Enabled`);
      console.log(`⚡ API Base: https://debate-tabulator.jawanich.my.id/api/`);
      console.log(`❤️ Health Check: https://debate-tabulator.jawanich.my.id/health`);
      console.log(`🔌 Backup: http://debate-tabulator.jawanich.my.id:8080/`);
      console.log('='.repeat(60));
      console.log('📝 Available Endpoints:');
      console.log('  POST /api/rounds         - Save round data');
      console.log('  GET  /api/rounds         - Get all rounds');
      console.log('  GET  /api/rankings       - Get team rankings');
      console.log('  GET  /api/best-speakers  - Get speaker rankings');
      console.log('  GET  /health             - Health check');
      console.log('='.repeat(60));
      console.log('✅ Ready for production use!');
    });
  })
  .catch(error => {
    console.error('❌ Failed to start API server:', error);
    process.exit(1);
  });
