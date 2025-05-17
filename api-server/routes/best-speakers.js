import express from 'express';
import { getCollections } from '../lib/mongodb.js';

const router = express.Router();

// GET - Get best speakers
router.get('/', async (req, res) => {
  try {
    const { speakers } = await getCollections();
    
    // Aggregate best speaker rankings
    const bestSpeakers = await speakers.aggregate([
      {
        $addFields: {
          totalScore: { $sum: "$scores.score" },
          roundsCount: { $size: "$scores" },
          averageScore: { $avg: "$scores.score" }
        }
      },
      {
        $sort: { totalScore: -1, averageScore: -1 }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          team: 1,
          university: 1,
          position: 1,
          totalScore: 1,
          averageScore: { $round: ["$averageScore", 2] },
          roundsCount: 1,
          scores: 1
        }
      }
    ]).toArray();

    // Add ranking position
    const rankedSpeakers = bestSpeakers.map((speaker, index) => ({
      ...speaker,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: rankedSpeakers
    });

  } catch (error) {
    console.error('Error fetching best speakers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch best speakers',
      details: error.message 
    });
  }
});

export default router;
