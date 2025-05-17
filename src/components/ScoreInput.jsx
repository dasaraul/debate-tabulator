import React, { useState } from 'react';

/**
 * Komponen untuk input skor debat dengan koneksi ke API server
 * @author made by Tamaes
 */
const ScoreInput = ({ onSave }) => {
  const [round, setRound] = useState('BP 1');
  const [room, setRoom] = useState('Room A');
  const [motion, setMotion] = useState('This House believes...');
  const [loading, setLoading] = useState(false);
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

  // API base URL - detects environment
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      const isDev = window.location.hostname === 'localhost';
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      
      if (isDev) {
        return 'http://localhost:3001';
      } else {
        return `${protocol}//${hostname}:3001`;
      }
    }
    return 'http://localhost:3001';
  };

  /**
   * Memperbarui skor pembicara dan menghitung skor tim secara otomatis
   * @author made by Tamaes
   */
  const updateSpeakerScore = (position, speakerIndex, value) => {
    const newScores = {...scores};
    newScores[position].speakers[speakerIndex].score = parseInt(value) || 0;
    
    const speaker1Score = newScores[position].speakers[0].score || 0;
    const speaker2Score = newScores[position].speakers[1].score || 0;
    newScores[position].teamScore = (speaker1Score + speaker2Score) / 2;
    
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
   * Menangani submit form dan menyimpan ke API server
   * @author made by Tamaes
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSave = { round, room, motion, scores };
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}/api/rounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Data berhasil disimpan ke database!');
        // Reset form
        setScores({
          OG: { teamName: '', university: '', speakers: [{ position: 'PM', name: '', score: 0 }, { position: 'DPM', name: '', score: 0 }], teamScore: 0 },
          OO: { teamName: '', university: '', speakers: [{ position: 'LO', name: '', score: 0 }, { position: 'DLO', name: '', score: 0 }], teamScore: 0 },
          CG: { teamName: '', university: '', speakers: [{ position: 'MG', name: '', score: 0 }, { position: 'GW', name: '', score: 0 }], teamScore: 0 },
          CO: { teamName: '', university: '', speakers: [{ position: 'MO', name: '', score: 0 }, { position: 'OW', name: '', score: 0 }], teamScore: 0 }
        });
        setRound('BP 1');
        setRoom('Room A');
        setMotion('This House believes...');
        if (onSave) onSave(result);
      } else {
        alert(`❌ Error: ${result.error || 'Failed to save data'}`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('❌ Gagal menghubungi server. Periksa koneksi internet dan pastikan API server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Input Skor Debat</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1">Ronde *</label>
            <select 
              className="w-full p-2 border rounded"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              required
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
            <label className="block mb-1">Room *</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Mosi *</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Form for each position */}
        {Object.entries(scores).map(([position, data]) => (
          <div key={position} className="mb-8 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">{position}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Nama Tim *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  value={data.teamName}
                  onChange={(e) => updateTeamInfo(position, 'teamName', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Universitas *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  value={data.university}
                  onChange={(e) => updateTeamInfo(position, 'university', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {data.speakers.map((speaker, index) => (
                <div key={index}>
                  <label className="block mb-1">{speaker.position} *</label>
                  <input 
                    type="text" 
                    placeholder="Nama Peserta"
                    className="w-full p-2 border rounded mb-2"
                    value={speaker.name}
                    onChange={(e) => {
                      const newScores = {...scores};
                      newScores[position].speakers[index].name = e.target.value;
                      setScores(newScores);
                    }}
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Skor (60-90)"
                    className="w-full p-2 border rounded"
                    min="60"
                    max="90"
                    value={speaker.score || ''}
                    onChange={(e) => updateSpeakerScore(position, index, e.target.value)}
                    required
                  />
                </div>
              ))}
              
              <div>
                <label className="block mb-1">Team Score</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded bg-gray-100"
                  disabled
                  value={data.teamScore.toFixed(2)}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Dihitung otomatis dari rata-rata 2 speaker
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center gap-4">
          <button 
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-medium ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Menyimpan...' : 'Simpan ke Database'}
          </button>
          
          {loading && (
            <div className="text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>* = Field wajib diisi</p>
          <p>💾 Data akan disimpan ke MongoDB melalui API server</p>
          <p>🔄 Ranking dan Victory Points dihitung otomatis</p>
        </div>
      </form>
    </div>
  );
};

export default ScoreInput;
