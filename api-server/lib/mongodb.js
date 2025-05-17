import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let db = null;

export async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DATABASE_NAME || 'debate_tabulator';
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(dbName);
    
    console.log('✅ Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

export async function getCollections() {
  const database = await connectToDatabase();
  
  return {
    rounds: database.collection('rounds'),
    teams: database.collection('teams'),
    speakers: database.collection('speakers'),
    tournaments: database.collection('tournaments')
  };
}
