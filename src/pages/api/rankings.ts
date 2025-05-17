import type { APIRoute } from 'astro';
import { getCollections } from '../../../lib/mongodb';

/**
 * API endpoint untuk mengambil data peringkat tim berdasarkan Victory Points
 * @author made by Tamaes
 */
export const GET: APIRoute = async () => {
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

    return new Response(JSON.stringify({
      success: true,
      data: rankedTeams
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching team rankings:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch team rankings',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};