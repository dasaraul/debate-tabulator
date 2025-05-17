import React, { useState } from 'react';

/**
 * Komponen untuk input skor debat dengan integrasi database real-time
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

  /**
   * Deteksi environment dan return URL API yang benar
   * @author made by Tamaes
   */
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      // Development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001';
      }
      
      // Production - gunakan domain yang sama dengan endpoint /api
      if (hostname === 'debate-tabulator.jawanich.my.id') {
        return `${protocol}//${hostname}/api`;
      }
      
      // Server IP fallback
      if (hostname === '128.199.164.94') {
        return `${protocol}//${hostname}/api`;
      }
      
      // Default fallback
      return `${protocol}//${hostname}/api`;
    }
    
    // Fallback untuk server-side rendering
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
   * Validasi form sebelum submit
   * @author made by Tamaes
   */
  const validateForm = () => {
    // Check basic fields
    if (!round || !room || !motion) {
      alert('❌ Mohon isi semua field: Ronde, Room, dan Mosi');
      return false;
    }

    // Check each team
    for (const position of ['OG', 'OO', 'CG', 'CO']) {
      const team = scores[position];
      
      if (!team.teamName || !team.university) {
        alert(`❌ Mohon isi nama tim dan universitas untuk posisi ${position}`);
        return false;
      }

      for (const speaker of team.speakers) {
        if (!speaker.name || speaker.score === 0) {
          alert(`❌ Mohon isi nama dan skor untuk speaker ${speaker.position} di posisi ${position}`);
          return false;
        }

        if (speaker.score < 60 || speaker.score > 90) {
          alert(`❌ Skor ${speaker.position} (${position}) harus antara 60-90`);
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Menangani submit form dan menyimpan ke database melalui API server
   * @author made by Tamaes
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const dataToSave = { round, room, motion, scores };
      const apiUrl = getApiUrl();
      const endpoint = apiUrl.includes('/api') ? `${apiUrl}/rounds` : `${apiUrl}/api/rounds`;
      
      console.log('🚀 Sending data to API:', endpoint);
      console.log('📡 Environment:', window.location.hostname);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message with results
        const resultText = result.data.results.map(r => 
          `${r.position}: ${r.teamName} (Rank ${r.rank}, VP ${r.vp})`
        ).join('\n');
        
        alert('✅ Data berhasil disimpan ke MongoDB!\n\n' + 
              `🏆 Hasil Otomatis:\n${resultText}\n\n` +
              `📝 Round: ${result.data.round}\n` +
              `🏢 Room: ${result.data.room}\n` +
              `⏰ Waktu: ${new Date(result.data.createdAt).toLocaleString()}`);
        
        // Reset form setelah berhasil
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
        throw new Error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('❌ Error saving data:', error);
      
      let errorMessage = '❌ Gagal menyimpan data!\n\n';
      errorMessage += `Error: ${error.message}\n\n`;
      errorMessage += 'Kemungkinan penyebab:\n';
      errorMessage += '• API server tidak berjalan (port 3001)\n';
      errorMessage += '• Masalah koneksi database MongoDB\n';
      errorMessage += '• Masalah jaringan atau CORS\n';
      errorMessage += '• Nginx proxy configuration error\n\n';
      errorMessage += 'Debug info:\n';
      errorMessage += `• API endpoint: ${getApiUrl()}\n`;
      errorMessage += `• Environment: ${window.location.hostname}\n`;
      errorMessage += `• Silakan cek console browser untuk detail error`;
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Input Skor Debat</h2>
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-green-800 text-sm">
          🟢 <strong>Production Mode</strong> • Terhubung ke MongoDB produksi • 
          Domain: <code className="bg-green-100 px-1 rounded">{typeof window !== 'undefined' ? window.location.hostname : 'loading...'}</code>
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Ronde *</label>
            <select 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            <label className="block mb-1 font-medium">Room *</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g., Room A"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Mosi *</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              placeholder="This House believes..."
              required
            />
          </div>
        </div>
        
        {/* Form for each position */}
        {Object.entries(scores).map(([position, data]) => (
          <div key={position} className={`mb-8 p-4 border rounded-lg ${
            position === 'OG' ? 'border-blue-300 bg-blue-50' :
            position === 'OO' ? 'border-red-300 bg-red-50' :
            position === 'CG' ? 'border-green-300 bg-green-50' :
            'border-yellow-300 bg-yellow-50'
          }`}>
            <h3 className="text-lg font-semibold mb-2">{position}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Nama Tim *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={data.teamName}
                  onChange={(e) => updateTeamInfo(position, 'teamName', e.target.value)}
                  placeholder="Nama tim"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Universitas *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={data.university}
                  onChange={(e) => updateTeamInfo(position, 'university', e.target.value)}
                  placeholder="Nama universitas"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {data.speakers.map((speaker, index) => (
                <div key={index}>
                  <label className="block mb-1 font-medium">{speaker.position} *</label>
                  <input 
                    type="text" 
                    placeholder="Nama peserta"
                    className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    min="60"
                    max="90"
                    value={speaker.score || ''}
                    onChange={(e) => updateSpeakerScore(position, index, e.target.value)}
                    required
                  />
                </div>
              ))}
              
              <div>
                <label className="block mb-1 font-medium">Team Score</label>
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
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Menyimpan ke MongoDB...' : 'Simpan ke MongoDB'}
          </button>
          
          {loading && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Connecting to API server...</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-2">ℹ️ Informasi Sistem:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>* = Field wajib diisi</li>
            <li>💾 Data tersimpan di MongoDB Atlas secara real-time</li>
            <li>🔄 Ranking dan Victory Points dihitung otomatis</li>
            <li>🏆 Update koleksi teams dan speakers otomatis</li>
            <li>📊 Lihat hasil di halaman Rankings dan Best Speakers</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ScoreInput;
