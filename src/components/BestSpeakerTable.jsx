import React from 'react';

/**
 * Komponen untuk menampilkan tabel peringkat best speaker
 * @author made by Tamaes
 */
const BestSpeakerTable = ({ speakerData }) => {
  if (!speakerData || speakerData.length === 0) {
    return <p>Belum ada data best speaker tersedia.</p>;
  }

  return (
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 border text-left">Rank</th>
            <th class="py-2 px-4 border text-left">Nama</th>
            <th class="py-2 px-4 border text-left">Tim</th>
            <th class="py-2 px-4 border text-left">Universitas</th>
            <th class="py-2 px-4 border text-left">BP 1</th>
            <th class="py-2 px-4 border text-left">BP 2</th>
            <th class="py-2 px-4 border text-left">Semifinal</th>
            <th class="py-2 px-4 border text-left">Final 1</th>
            <th class="py-2 px-4 border text-left">Final 2</th>
            <th class="py-2 px-4 border text-left">Final 3</th>
            <th class="py-2 px-4 border text-left">Total</th>
            <th class="py-2 px-4 border text-left">Rata-Rata</th>
          </tr>
        </thead>
        <tbody>
          {speakerData.map((speaker, index) => (
            <tr key={index} class={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td class="py-2 px-4 border">{index + 1}</td>
              <td class="py-2 px-4 border">{speaker.name}</td>
              <td class="py-2 px-4 border">{speaker.team}</td>
              <td class="py-2 px-4 border">{speaker.university}</td>
              <td class="py-2 px-4 border">{speaker.scores[0] || '-'}</td>
              <td class="py-2 px-4 border">{speaker.scores[1] || '-'}</td>
              <td class="py-2 px-4 border">{speaker.scores[2] || '-'}</td>
              <td class="py-2 px-4 border">{speaker.scores[3] || '-'}</td>
              <td class="py-2 px-4 border">{speaker.scores[4] || '-'}</td>
              <td class="py-2 px-4 border">{speaker.scores[5] || '-'}</td>
              <td class="py-2 px-4 border font-bold">{speaker.totalScore}</td>
              <td class="py-2 px-4 border">{speaker.average.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BestSpeakerTable;