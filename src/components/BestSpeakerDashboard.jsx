import React, { useState } from 'react';
import { calculateBestSpeaker } from '../utils/scoreCalculations';

/**
 * Komponen dashboard untuk menampilkan peringkat best speaker
 * dengan fitur filter dan pencarian
 * @author made by Tamaes
 */
const BestSpeakerDashboard = ({ speakerData }) => {
  const [filterRound, setFilterRound] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  /**
   * Filter data speaker berdasarkan ronde dan kriteria pencarian
   * @author made by Tamaes
   */
  const filteredSpeakers = speakerData.filter(speaker => {
    // Filter berdasarkan pencarian
    const matchesQuery = speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         speaker.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         speaker.university.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter berdasarkan ronde
    if (filterRound === 'all') {
      return matchesQuery;
    } else {
      return matchesQuery && speaker.scores[filterRound] !== undefined;
    }
  });
  
  /**
   * Mendapatkan semua ronde yang tersedia dari data speaker
   * @author made by Tamaes
   */
  const availableRounds = ['all'];
  speakerData.forEach(speaker => {
    Object.keys(speaker.scores).forEach(round => {
      if (!availableRounds.includes(round)) {
        availableRounds.push(round);
      }
    });
  });
  
  return (
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Best Speaker Dashboard</h2>
        
        <div class="flex space-x-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Filter Ronde</label>
            <select
              value={filterRound}
              onChange={(e) => setFilterRound(e.target.value)}
              class="border rounded px-3 py-1"
            >
              {availableRounds.map(round => (
                <option key={round} value={round}>
                  {round === 'all' ? 'Semua Ronde' : round}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 mb-1">Cari</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nama, Tim, Universitas..."
              class="border rounded px-3 py-1"
            />
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 border text-left">Rank</th>
              <th class="py-2 px-4 border text-left">Nama</th>
              <th class="py-2 px-4 border text-left">Tim</th>
              <th class="py-2 px-4 border text-left">Universitas</th>
              
              {/* Kolom dinamis berdasarkan ronde yang tersedia */}
              {availableRounds
                .filter(round => round !== 'all')
                .map(round => (
                  <th key={round} class="py-2 px-4 border text-left">
                    {round}
                  </th>
                ))
              }
              
              <th class="py-2 px-4 border text-left font-bold">Total</th>
              <th class="py-2 px-4 border text-left">Rata-Rata</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpeakers.map((speaker, index) => (
              <tr key={index} class={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td class="py-2 px-4 border">{index + 1}</td>
                <td class="py-2 px-4 border font-medium">{speaker.name}</td>
                <td class="py-2 px-4 border">{speaker.team}</td>
                <td class="py-2 px-4 border">{speaker.university}</td>
                
                {/* Cell dinamis untuk skor per ronde */}
                {availableRounds
                  .filter(round => round !== 'all')
                  .map(round => (
                    <td 
                      key={round} 
                      class={`py-2 px-4 border ${speaker.scores[round] ? '' : 'bg-gray-100'}`}
                    >
                      {speaker.scores[round] || '-'}
                    </td>
                  ))
                }
                
                <td class="py-2 px-4 border font-bold">{speaker.totalScore}</td>
                <td class="py-2 px-4 border">{speaker.average.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Visualisasi Top 3 Speaker */}
      <div class="mt-12">
        <h3 class="text-xl font-semibold mb-6">Top 3 Best Speaker</h3>
        
        <div class="flex justify-center items-end space-x-12">
          {/* Second Place */}
          {filteredSpeakers.length > 1 && (
            <div class="flex flex-col items-center">
              <div class="text-lg mb-2">{filteredSpeakers[1].name}</div>
              <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <span class="text-gray-600">2</span>
              </div>
              <div class="w-32 bg-gray-400 h-48 flex items-center justify-center text-white text-2xl font-bold rounded-t-lg">
                {filteredSpeakers[1].totalScore}
              </div>
              <div class="bg-gray-200 w-32 py-2 text-center rounded-b-lg">Runner Up</div>
            </div>
          )}
          
          {/* First Place */}
          {filteredSpeakers.length > 0 && (
            <div class="flex flex-col items-center">
              <div class="text-lg mb-2">{filteredSpeakers[0].name}</div>
              <div class="w-32 h-32 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center mb-4">
                <span class="text-yellow-600 text-xl font-bold">1</span>
              </div>
              <div class="w-32 bg-yellow-500 h-64 flex items-center justify-center text-white text-2xl font-bold rounded-t-lg">
                {filteredSpeakers[0].totalScore}
              </div>
              <div class="bg-yellow-200 w-32 py-2 text-center rounded-b-lg font-medium">Best Speaker</div>
            </div>
          )}
          
          {/* Third Place */}
          {filteredSpeakers.length > 2 && (
            <div class="flex flex-col items-center">
              <div class="text-lg mb-2">{filteredSpeakers[2].name}</div>
              <div class="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <span class="text-orange-600">3</span>
              </div>
              <div class="w-32 bg-orange-400 h-32 flex items-center justify-center text-white text-2xl font-bold rounded-t-lg">
                {filteredSpeakers[2].totalScore}
              </div>
              <div class="bg-orange-200 w-32 py-2 text-center rounded-b-lg">Third Place</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSpeakerDashboard;