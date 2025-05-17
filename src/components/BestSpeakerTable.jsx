import React from 'react';

const BestSpeakerTable = ({ speakerData }) => {
  if (!speakerData || speakerData.length === 0) {
    return <p>Belum ada data best speaker tersedia.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border text-left">Rank</th>
            <th className="py-2 px-4 border text-left">Nama</th>
            <th className="py-2 px-4 border text-left">Tim</th>
            <th className="py-2 px-4 border text-left">Universitas</th>
            <th className="py-2 px-4 border text-left">BP 1</th>
            <th className="py-2 px-4 border text-left">BP 2</th>
            <th className="py-2 px-4 border text-left">Semifinal</th>
            <th className="py-2 px-4 border text-left">Final 1</th>
            <th className="py-2 px-4 border text-left">Final 2</th>
            <th className="py-2 px-4 border text-left">Final 3</th>
            <th className="py-2 px-4 border text-left">Total</th>
            <th className="py-2 px-4 border text-left">Rata-Rata</th>
          </tr>
        </thead>
        <tbody>
          {speakerData.map((speaker, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-4 border">{index + 1}</td>
              <td className="py-2 px-4 border">{speaker.name}</td>
              <td className="py-2 px-4 border">{speaker.team}</td>
              <td className="py-2 px-4 border">{speaker.university}</td>
              <td className="py-2 px-4 border">{speaker.scores[0] || '-'}</td>
              <td className="py-2 px-4 border">{speaker.scores[1] || '-'}</td>
              <td className="py-2 px-4 border">{speaker.scores[2] || '-'}</td>
              <td className="py-2 px-4 border">{speaker.scores[3] || '-'}</td>
              <td className="py-2 px-4 border">{speaker.scores[4] || '-'}</td>
              <td className="py-2 px-4 border">{speaker.scores[5] || '-'}</td>
              <td className="py-2 px-4 border font-bold">{speaker.totalScore}</td>
              <td className="py-2 px-4 border">{speaker.average.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BestSpeakerTable;