import type { APIRoute } from 'astro';
import { getCollections } from '../../../lib/mongodb.js';

/**
 * API endpoint untuk mengambil data best speaker
 * @author made by Tamaes
 */
export const GET: APIRoute = async () => {
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

    return new Response(JSON.stringify({
      success: true,
      data: rankedSpeakers
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching best speakers:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch best speakers',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};