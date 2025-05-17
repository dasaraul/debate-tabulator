import express from 'express';
import { getCollections } from '../lib/mongodb.js';

const router = express.Router();

// POST - Save round data
router.post('/', async (req, res) => {
  try {
    const { rounds } = await getCollections();
    const data = req.body;
    
    // Validate required fields
    if (!data.round || !data.room || !data.scores) {
      return res.status(400).json({ 
        error: 'Missing required fields: round, room, scores' 
      });
    }

    // Calculate rankings and VP
    const roundData = {
      ...data,
      createdAt: new Date(),
      results: calculateRankingsAndVP(data.scores)
    };

    // Insert to MongoDB
    const result = await rounds.insertOne(roundData);
    
    // Update team and speaker collections
    await updateTeamsAndSpeakers(roundData);

    res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Round data saved successfully',
      data: roundData
    });

  } catch (error) {
    console.error('Error saving round data:', error);
    res.status(500).json({ 
      error: 'Failed to save round data',
      details: error.message 
    });
  }
});

// GET - Get all rounds
router.get('/', async (req, res) => {
  try {
    const { rounds } = await getCollections();
    const allRounds = await rounds.find({}).sort({ createdAt: -1 }).toArray();

    res.json({
      success: true,
      data: allRounds
    });

  } catch (error) {
    console.error('Error fetching rounds:', error);
    res.status(500).json({ 
      error: 'Failed to fetch rounds',
      details: error.message 
    });
  }
});

// Calculate rankings and Victory Points
function calculateRankingsAndVP(scores) {
  const teams = Object.entries(scores).map(([position, teamData]) => {
    const speaker1Score = teamData.speakers[0].score || 0;
    const speaker2Score = teamData.speakers[1].score || 0;
    const teamScore = (speaker1Score + speaker2Score) / 2;

    return {
      position,
      teamName: teamData.teamName,
      university: teamData.university,
      speakers: teamData.speakers,
      teamScore
    };
  });

  // Sort teams by team score (descending)
  teams.sort((a, b) => b.teamScore - a.teamScore);

  // Assign rankings and Victory Points
  return teams.map((team, index) => {
    let vp = 0;
    const rank = index + 1;
    
    switch (rank) {
      case 1: vp = 3; break;
      case 2: vp = 2; break;
      case 3: vp = 1; break;
      case 4: vp = 0; break;
    }

    return { ...team, rank, vp };
  });
}

// Update teams and speakers collections
async function updateTeamsAndSpeakers(roundData) {
  const { teams, speakers } = await getCollections();
  
  for (const result of roundData.results) {
    // Update team data
    await teams.updateOne(
      { name: result.teamName },
      {
        $set: {
          name: result.teamName,
          university: result.university,
          position: result.position
        },
        $push: {
          rounds: {
            round: roundData.round,
            teamScore: result.teamScore,
            rank: result.rank,
            vp: result.vp,
            date: roundData.createdAt
          }
        }
      },
      { upsert: true }
    );

    // Update speaker data
    for (const speaker of result.speakers) {
      await speakers.updateOne(
        { name: speaker.name, team: result.teamName },
        {
          $set: {
            name: speaker.name,
            team: result.teamName,
            university: result.university,
            position: speaker.position
          },
          $push: {
            scores: {
              round: roundData.round,
              score: speaker.score,
              date: roundData.createdAt
            }
          }
        },
        { upsert: true }
      );
    }
  }
}

export default router;
