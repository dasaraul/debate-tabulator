import React, { useState } from 'react';
import { calculateTeamAverage } from '../utils/scoreCalculations';

/**
 * Komponen untuk input skor debat
 * Memungkinkan pengguna memasukkan informasi tentang ronde, room, mosi, dan skor tim
 * @author made by Tamaes
 */
const ScoreInput = ({ onSave }) => {
  const [round, setRound] = useState('BP 1');
  const [room, setRoom] = useState('Room A');
  const [motion, setMotion] = useState('This House believes...');
  const [scores, setScores] = useState({
    OG: {
      teamName: '',
      university: '',
      speakers: [
        { position: 'PM', name: '', score: 0 },
        { position: 'DPM', name: '', score: 0 }
      ],
      teamScore: 0
    },
    OO: {
      teamName: '',
      university: '',
      speakers: [
        { position: 'LO', name: '', score: 0 },
        { position: 'DLO', name: '', score: 0 }
      ],
      teamScore: 0
    },
    CG: {
      teamName: '',
      university: '',
      speakers: [
        { position: 'MG', name: '', score: 0 },
        { position: 'GW', name: '', score: 0 }
      ],
      teamScore: 0
    },
    CO: {
      teamName: '',
      university: '',
      speakers: [
        { position: 'MO', name: '', score: 0 },
        { position: 'OW', name: '', score: 0 }
      ],
      teamScore: 0
    }
  });

  /**
   * Memperbarui skor pembicara dan menghitung skor tim secara otomatis
   * @author made by Tamaes
   */
  const updateSpeakerScore = (position, speakerIndex, value) => {
    const newScores = {...scores};
    newScores[position].speakers[speakerIndex].score = parseInt(value);
    
    const speaker1Score = newScores[position].speakers[0].score || 0;
    const speaker2Score = newScores[position].speakers[1].score || 0;
    newScores[position].teamScore = calculateTeamAverage(speaker1Score, speaker2Score);
    
    setScores(newScores);
  };

  /**
   * Memperbarui informasi tim (nama tim dan universitas)
   * @author made by Tamaes
   */
  const updateTeamInfo = (position, field, value) => {
    const newScores = {...scores};
    newScores[position][field] = value;
    setScores(newScores);
  };

  /**
   * Menangani submit form
   * @author made by Tamaes
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ round, room, motion, scores });
  };

  return (
    <div class="p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Input Skor Debat</h2>
      
      <form onSubmit={handleSubmit}>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block mb-1">Ronde</label>
            <select 
              class="w-full p-2 border rounded"
              value={round}
              onChange={(e) => setRound(e.target.value)}
            >
              <option value="BP 1">BP 1</option>
              <option value="BP 2">BP 2</option>
              <option value="Semifinal">Semifinal</option>
              <option value="Final 1">Final 1</option>
              <option value="Final 2">Final 2</option>
              <option value="Final 3">Final 3</option>
            </select>
          </div>
          
          <div>
            <label class="block mb-1">Room</label>
            <input 
              type="text" 
              class="w-full p-2 border rounded"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          
          <div>
            <label class="block mb-1">Mosi</label>
            <input 
              type="text" 
              class="w-full p-2 border rounded"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
            />
          </div>
        </div>
        
        {/* Rendering untuk setiap posisi (OG, OO, CG, CO) */}
        {Object.entries(scores).map(([position, data]) => (
          <div key={position} class="mb-8 p-4 border rounded">
            <h3 class="text-lg font-semibold mb-2">{position}</h3>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block mb-1">Nama Tim</label>
                <input 
                  type="text" 
                  class="w-full p-2 border rounded"
                  value={data.teamName}
                  onChange={(e) => updateTeamInfo(position, 'teamName', e.target.value)}
                />
              </div>
              
              <div>
                <label class="block mb-1">Universitas</label>
                <input 
                  type="text" 
                  class="w-full p-2 border rounded"
                  value={data.university}
                  onChange={(e) => updateTeamInfo(position, 'university', e.target.value)}
                />
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4">
              {data.speakers.map((speaker, index) => (
                <div key={index}>
                  <label class="block mb-1">{speaker.position}</label>
                  <input 
                    type="text" 
                    placeholder="Nama Peserta"
                    class="w-full p-2 border rounded mb-2"
                    value={speaker.name}
                    onChange={(e) => {
                      const newScores = {...scores};
                      newScores[position].speakers[index].name = e.target.value;
                      setScores(newScores);
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="Skor"
                    class="w-full p-2 border rounded"
                    min="60"
                    max="90"
                    value={speaker.score || ''}
                    onChange={(e) => updateSpeakerScore(position, index, e.target.value)}
                  />
                </div>
              ))}
              
              <div>
                <label class="block mb-1">Team Score</label>
                <input 
                  type="number" 
                  class="w-full p-2 border rounded bg-gray-100"
                  disabled
                  value={data.teamScore.toFixed(2)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <button 
          type="submit"
          class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Simpan Hasil
        </button>
      </form>
    </div>
  );
};

export default ScoreInput;