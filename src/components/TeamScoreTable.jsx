import React from 'react';

/**
 * Komponen untuk menampilkan tabel skor tim dalam suatu ronde
 * @author made by Tamaes
 */
const TeamScoreTable = ({ roundData }) => {
  if (!roundData || !roundData.results || roundData.results.length === 0) {
    return <p>Belum ada data tersedia.</p>;
  }

  return (
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 border text-left">Posisi</th>
            <th class="py-2 px-4 border text-left">Tim</th>
            <th class="py-2 px-4 border text-left">Universitas</th>
            <th class="py-2 px-4 border text-left">Speaker 1</th>
            <th class="py-2 px-4 border text-left">Skor</th>
            <th class="py-2 px-4 border text-left">Speaker 2</th>
            <th class="py-2 px-4 border text-left">Skor</th>
            <th class="py-2 px-4 border text-left">Team Score</th>
            <th class="py-2 px-4 border text-left">Rank</th>
            <th class="py-2 px-4 border text-left">VP</th>
          </tr>
        </thead>
        <tbody>
          {roundData.results.map((team, index) => (
            <tr key={index} class={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td class="py-2 px-4 border">{team.position}</td>
              <td class="py-2 px-4 border">{team.teamName}</td>
              <td class="py-2 px-4 border">{team.university}</td>
              <td class="py-2 px-4 border">{team.speakers[0].name}</td>
              <td class="py-2 px-4 border">{team.speakers[0].score}</td>
              <td class="py-2 px-4 border">{team.speakers[1].name}</td>
              <td class="py-2 px-4 border">{team.speakers[1].score}</td>
              <td class="py-2 px-4 border font-semibold">{team.teamScore.toFixed(2)}</td>
              <td class="py-2 px-4 border">{team.rank}</td>
              <td class="py-2 px-4 border font-bold">{team.vp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamScoreTable;