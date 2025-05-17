import type { APIRoute } from 'astro';
import { getCollections } from '../../../lib/mongodb.js';

/**
 * API endpoint untuk menyimpan skor ronde debat
 * @author made by Tamaes
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { rounds } = await getCollections();
    const data = await request.json();
    
    // Validate required fields
    if (!data.round || !data.room || !data.scores) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: round, room, scores' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add timestamp and calculate rankings
    const roundData = {
      ...data,
      createdAt: new Date(),
      results: calculateRankingsAndVP(data.scores)
    };

    // Insert to MongoDB
    const result = await rounds.insertOne(roundData);
    
    // Also update team and speaker collections
    await updateTeamsAndSpeakers(roundData);

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.insertedId,
      message: 'Round data saved successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error saving round data:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save round data',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * API endpoint untuk mengambil data semua ronde
 * @author made by Tamaes
 */
export const GET: APIRoute = async () => {
  try {
    const { rounds } = await getCollections();
    const allRounds = await rounds.find({}).sort({ createdAt: -1 }).toArray();

    return new Response(JSON.stringify({
      success: true,
      data: allRounds
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching rounds:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch rounds',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Menghitung ranking dan Victory Points berdasarkan skor tim
 * @author made by Tamaes
 */
function calculateRankingsAndVP(scores) {
  const teams = Object.entries(scores).map(([position, teamData]) => {
    // Calculate team score (average of speakers)
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
  const results = teams.map((team, index) => {
    let vp = 0;
    const rank = index + 1;
    
    switch (rank) {
      case 1: vp = 3; break;
      case 2: vp = 2; break;
      case 3: vp = 1; break;
      case 4: vp = 0; break;
    }

    return {
      ...team,
      rank,
      vp
    };
  });

  return results;
}

/**
 * Update koleksi teams dan speakers dengan data terbaru
 * @author made by Tamaes
 */
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