import React from 'react';

const TeamScoreTable = ({ roundData }) => {
  if (!roundData || !roundData.results || roundData.results.length === 0) {
    return <p>Belum ada data tersedia.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border text-left">Posisi</th>
            <th className="py-2 px-4 border text-left">Tim</th>
            <th className="py-2 px-4 border text-left">Universitas</th>
            <th className="py-2 px-4 border text-left">Speaker 1</th>
            <th className="py-2 px-4 border text-left">Skor</th>
            <th className="py-2 px-4 border text-left">Speaker 2</th>
            <th className="py-2 px-4 border text-left">Skor</th>
            <th className="py-2 px-4 border text-left">Team Score</th>
            <th className="py-2 px-4 border text-left">Rank</th>
            <th className="py-2 px-4 border text-left">VP</th>
          </tr>
        </thead>
        <tbody>
          {roundData.results.map((team, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-4 border">{team.position}</td>
              <td className="py-2 px-4 border">{team.teamName}</td>
              <td className="py-2 px-4 border">{team.university}</td>
              <td className="py-2 px-4 border">{team.speakers[0].name}</td>
              <td className="py-2 px-4 border">{team.speakers[0].score}</td>
              <td className="py-2 px-4 border">{team.speakers[1].name}</td>
              <td className="py-2 px-4 border">{team.speakers[1].score}</td>
              <td className="py-2 px-4 border font-semibold">{team.teamScore.toFixed(2)}</td>
              <td className="py-2 px-4 border">{team.rank}</td>
              <td className="py-2 px-4 border font-bold">{team.vp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamScoreTable;