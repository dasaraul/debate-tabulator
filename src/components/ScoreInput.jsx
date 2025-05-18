import React, { useState } from 'react';

/**
 * Komponen untuk input skor debat dengan integrasi HTTPS dan multiple endpoints
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
   * Get multiple API endpoints dengan priority order
   * @author made by Tamaes
   */
  const getApiEndpoints = () => {
    if (typeof window === 'undefined') return ['http://localhost:3001'];
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return [
        'http://localhost:3001/api',
        'http://localhost:3001'
      ];
    }
    
    // Production - multiple fallback endpoints
    const endpoints = [];
    
    // Priority 1: HTTPS main domain
    if (protocol === 'https:' && hostname === 'debate-tabulator.jawanich.my.id') {
      endpoints.push('https://debate-tabulator.jawanich.my.id/api');
    }
    
    // Priority 2: HTTP main domain + port
    if (hostname === 'debate-tabulator.jawanich.my.id') {
      endpoints.push('http://debate-tabulator.jawanich.my.id:8080/api');
    }
    
    // Priority 3: Direct IP + port
    endpoints.push('http://128.199.164.94:8080/api');
    
    // Priority 4: Current hostname fallback
    if (!endpoints.includes(`${protocol}//${hostname}/api`)) {
      endpoints.push(`${protocol}//${hostname}/api`);
    }
    
    return endpoints;
  };

  // Component functions (unchanged)
  const updateSpeakerScore = (position, speakerIndex, value) => {
    const newScores = {...scores};
    newScores[position].speakers[speakerIndex].score = parseInt(value) || 0;
    
    const speaker1Score = newScores[position].speakers[0].score || 0;
    const speaker2Score = newScores[position].speakers[1].score || 0;
    newScores[position].teamScore = (speaker1Score + speaker2Score) / 2;
    
    setScores(newScores);
  };

  const updateTeamInfo = (position, field, value) => {
    const newScores = {...scores};
    newScores[position][field] = value;
    setScores(newScores);
  };

  const validateForm = () => {
    if (!round || !room || !motion) {
      alert('❌ Mohon isi semua field: Ronde, Room, dan Mosi');
      return false;
    }

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
   * Submit dengan multiple endpoint fallback untuk reliability
   * @author made by Tamaes
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    const dataToSave = { round, room, motion, scores };
    const endpoints = getApiEndpoints();
    
    let success = false;
    let lastError = null;
    let successEndpoint = null;
    
    console.log('🚀 Trying endpoints:', endpoints);
    
    for (const baseUrl of endpoints) {
      const endpoint = `${baseUrl}/rounds`;
      
      try {
        console.log(`📡 Attempting: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSave)
        });

        const result = await response.json();

        if (response.ok) {
          // Success!
          const resultText = result.data.results.map(r => 
            `${r.position}: ${r.teamName} (Rank ${r.rank}, VP ${r.vp})`
          ).join('\n');
          
          alert(`✅ Data berhasil disimpan ke MongoDB!\n\n` + 
                `🏆 Hasil Otomatis:\n${resultText}\n\n` +
                `📝 Round: ${result.data.round}\n` +
                `🏢 Room: ${result.data.room}\n` +
                `⏰ Waktu: ${new Date(result.data.createdAt).toLocaleString()}\n\n` +
                `📡 Endpoint: ${endpoint}`);
          
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
          success = true;
          successEndpoint = endpoint;
          break;
        } else {
          throw new Error(result.error || `HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn(`❌ ${endpoint} failed:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    if (!success) {
      console.error('❌ All endpoints failed:', lastError);
      alert(`❌ Gagal menyimpan data ke semua endpoint!\n\n` + 
            `Last error: ${lastError?.message || 'Unknown error'}\n\n` +
            `Endpoints tried:\n${endpoints.map(url => `• ${url}/rounds`).join('\n')}\n\n` +
            `🔧 Troubleshooting:\n` +
            `• Cek koneksi internet\n` +
            `• Coba refresh halaman\n` +
            `• Hubungi admin jika masalah berlanjut`);
    }
    
    setLoading(false);
  };

  // Get current environment info for display
  const currentEndpoint = typeof window !== 'undefined' ? getApiEndpoints()[0] : 'Loading...';
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Input Skor Debat</h2>
      
      <div className="mb-4 p-3 rounded border">
        <div className={`text-sm ${isSecure ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <p className="font-medium">
            {isSecure ? '🔒 Secure HTTPS Connection' : '🌐 HTTP Connection'} • 
            Primary endpoint: <code className="bg-gray-100 px-1 rounded">{currentEndpoint}</code>
          </p>
          <p className="text-xs mt-1">
            Multiple fallback endpoints configured for reliability
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Ronde *</label>
            <select 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              placeholder="This House believes..."
              required
            />
          </div>
        </div>
        
        {/* Team input sections */}
        {Object.entries(scores).map(([position, data]) => (
          <div key={position} className={`mb-8 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
            position === 'OG' ? 'border-blue-300 bg-blue-50' :
            position === 'OO' ? 'border-red-300 bg-red-50' :
            position === 'CG' ? 'border-green-300 bg-green-50' :
            'border-yellow-300 bg-yellow-50'
          }`}>
            <h3 className="text-lg font-semibold mb-3">{position}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Nama Tim *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data.university}
                  onChange={(e) => updateTeamInfo(position, 'university', e.target.value)}
                  placeholder="Nama universitas"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {data.speakers.map((speaker, index) => (
                <div key={index} className="space-y-2">
                  <label className="block font-medium text-gray-700">{speaker.position} *</label>
                  <input 
                    type="text" 
                    placeholder="Nama peserta"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="60"
                    max="90"
                    value={speaker.score || ''}
                    onChange={(e) => updateSpeakerScore(position, index, e.target.value)}
                    required
                  />
                </div>
              ))}
              
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">Team Score</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded bg-gray-100 text-gray-700"
                  disabled
                  value={data.teamScore.toFixed(2)}
                />
                <div className="text-xs text-gray-500">
                  Dihitung otomatis dari rata-rata 2 speaker
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center gap-4 mb-4">
          <button 
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105'
            }`}
          >
            {loading ? 'Menyimpan ke MongoDB...' : 'Simpan ke MongoDB'}
          </button>
          
          {loading && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Trying multiple endpoints...</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded border">
          <p className="font-medium mb-2">ℹ️ System Information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>🔒 SSL/HTTPS enabled with multiple endpoint fallback</li>
            <li>💾 Data saved to MongoDB Atlas in real-time</li>
            <li>🔄 Rankings & Victory Points calculated automatically</li>
            <li>🏆 Teams & speakers collections updated automatically</li>
            <li>📊 View results in Rankings and Best Speakers pages</li>
            <li>🛡️ Form validation and error handling included</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ScoreInput;
