import { MongoClient } from 'mongodb';

/**
 * MongoDB connection utility
 * Handles connection to MongoDB Atlas database
 * @author made by Tamaes
 */

let client = null;
let db = null;

/**
 * Connect to MongoDB database
 * @returns {Promise<Database>} MongoDB database instance
 * @author made by Tamaes
 */
export async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    const mongoUri = import.meta.env.MONGODB_URI || process.env.MONGODB_URI;
    const dbName = import.meta.env.DATABASE_NAME || process.env.DATABASE_NAME || 'debate_tabulator';
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(dbName);
    
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Close MongoDB connection
 * @author made by Tamaes
 */
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * Get MongoDB collections
 * @author made by Tamaes
 */
export async function getCollections() {
  const database = await connectToDatabase();
  
  return {
    rounds: database.collection('rounds'),
    teams: database.collection('teams'),
    speakers: database.collection('speakers'),
    tournaments: database.collection('tournaments')
  };
}