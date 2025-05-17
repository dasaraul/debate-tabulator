import express from 'express';
import { getCollections } from '../lib/mongodb.js';

const router = express.Router();

/**
 * GET - Get team rankings based on Victory Points
 * @author made by Tamaes
 */
router.get('/', async (req, res) => {
  try {
    const { teams } = await getCollections();
    
    // Aggregate team rankings dengan total VP
    const teamRankings = await teams.aggregate([
      {
        $addFields: {
          totalVP: { $sum: "$rounds.vp" },
          roundsCount: { $size: "$rounds" }
        }
      },
      {
        $sort: { totalVP: -1, roundsCount: -1 }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          university: 1,
          totalVP: 1,
          roundsCount: 1,
          rounds: 1
        }
      }
    ]).toArray();

    // Add ranking position
    const rankedTeams = teamRankings.map((team, index) => ({
      ...team,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: rankedTeams
    });

  } catch (error) {
    console.error('Error fetching team rankings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch team rankings',
      details: error.message 
    });
  }
});

export default router;
