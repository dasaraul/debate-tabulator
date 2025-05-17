import React, { useState } from 'react';
import { hitungRataRataTim, tentukanVictoryPoints } from '../utils/scoreCalculations';

const PerhitunganVP = () => {
  const [skorPembicara, setSkorPembicara] = useState({
    OG: [76, 77],
    OO: [74, 73],
    CG: [75, 72],
    CO: [71, 70]
  });
  
  const [hasilPerhitungan, setHasilPerhitungan] = useState(null);
  
  // Hitung VP berdasarkan input user
  const hitungVP = () => {
    // Membuat array tim dari nilai input
    const timArray = [
      {
        posisi: "OG",
        namaTim: "Tim 1",
        pembicara: [
          { nama: "Pembicara 1", skor: skorPembicara.OG[0] },
          { nama: "Pembicara 2", skor: skorPembicara.OG[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.OG[0], skorPembicara.OG[1])
      },
      {
        posisi: "OO",
        namaTim: "Tim 2",
        pembicara: [
          { nama: "Pembicara 1", skor: skorPembicara.OO[0] },
          { nama: "Pembicara 2", skor: skorPembicara.OO[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.OO[0], skorPembicara.OO[1])
      },
      {
        posisi: "CG",
        namaTim: "Tim 3",
        pembicara: [
          { nama: "Pembicara 1", skor: skorPembicara.CG[0] },
          { nama: "Pembicara 2", skor: skorPembicara.CG[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.CG[0], skorPembicara.CG[1])
      },
      {
        posisi: "CO",
        namaTim: "Tim 4",
        pembicara: [
          { nama: "Pembicara 1", skor: skorPembicara.CO[0] },
          { nama: "Pembicara 2", skor: skorPembicara.CO[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.CO[0], skorPembicara.CO[1])
      }
    ];
    
    // Tentukan Victory Points
    const hasilDenganVP = tentukanVictoryPoints(timArray);
    setHasilPerhitungan(hasilDenganVP);
  };
  
  // Handler untuk perubahan nilai input
  const handleSkorChange = (posisi, index, nilai) => {
    setSkorPembicara(prev => {
      const skorBaru = { ...prev };
      skorBaru[posisi][index] = parseFloat(nilai);
      return skorBaru;
    });
  };
  
  return (
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Simulasi Perhitungan Victory Points</h2>
      
      <div class="mb-6">
        <p class="mb-4">
          Victory Points (VP) dihitung berdasarkan peringkat tim dalam satu ruangan debat. 
          Peringkat ditentukan oleh skor tim, yang merupakan rata-rata dari skor kedua pembicara dalam tim tersebut.
        </p>
        
        <div class="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
          <h3 class="font-semibold mb-2">Rumus Perhitungan:</h3>
          <ol class="list-decimal pl-5 space-y-2">
            <li><strong>Skor Tim</strong> = (Skor Pembicara 1 + Skor Pembicara 2) / 2</li>
            <li><strong>Peringkat</strong> ditentukan berdasarkan Skor Tim (tertinggi ke terendah)</li>
            <li><strong>Victory Points</strong> diberikan berdasarkan Peringkat:
              <ul class="list-disc pl-5 mt-1">
                <li>Peringkat #1: 3 VP</li>
                <li>Peringkat #2: 2 VP</li>
                <li>Peringkat #3: 1 VP</li>
                <li>Peringkat #4: 0 VP</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Masukkan Skor Pembicara</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input untuk OG */}
          <div class="border p-4 rounded bg-blue-50">
            <h4 class="font-semibold mb-2">Opening Government (OG)</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm mb-1">Pembicara 1 (PM)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.OG[0]}
                  onChange={(e) => handleSkorChange('OG', 0, e.target.value)}
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Pembicara 2 (DPM)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.OG[1]}
                  onChange={(e) => handleSkorChange('OG', 1, e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Input untuk OO */}
          <div class="border p-4 rounded bg-red-50">
            <h4 class="font-semibold mb-2">Opening Opposition (OO)</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm mb-1">Pembicara 1 (LO)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.OO[0]}
                  onChange={(e) => handleSkorChange('OO', 0, e.target.value)}
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Pembicara 2 (DLO)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.OO[1]}
                  onChange={(e) => handleSkorChange('OO', 1, e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Input untuk CG */}
          <div class="border p-4 rounded bg-green-50">
            <h4 class="font-semibold mb-2">Closing Government (CG)</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm mb-1">Pembicara 1 (MG)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.CG[0]}
                  onChange={(e) => handleSkorChange('CG', 0, e.target.value)}
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Pembicara 2 (GW)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.CG[1]}
                  onChange={(e) => handleSkorChange('CG', 1, e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Input untuk CO */}
          <div class="border p-4 rounded bg-yellow-50">
            <h4 class="font-semibold mb-2">Closing Opposition (CO)</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm mb-1">Pembicara 1 (MO)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.CO[0]}
                  onChange={(e) => handleSkorChange('CO', 0, e.target.value)}
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Pembicara 2 (OW)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  class="w-full p-2 border rounded"
                  value={skorPembicara.CO[1]}
                  onChange={(e) => handleSkorChange('CO', 1, e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <button 
          class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={hitungVP}
        >
          Hitung Victory Points
        </button>
      </div>
      
      {/* Hasil Perhitungan */}
      {hasilPerhitungan && (
        <div class="border p-6 rounded-lg bg-gray-50">
          <h3 class="text-xl font-semibold mb-4">Hasil Perhitungan</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full border">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 border">Posisi</th>
                  <th class="py-2 px-4 border">Tim</th>
                  <th class="py-2 px-4 border">Pembicara 1</th>
                  <th class="py-2 px-4 border">Pembicara 2</th>
                  <th class="py-2 px-4 border">Skor Tim</th>
                  <th class="py-2 px-4 border">Peringkat</th>
                  <th class="py-2 px-4 border font-bold">Victory Points</th>
                </tr>
              </thead>
              <tbody>
                {hasilPerhitungan.map((tim, index) => (
                  <tr key={index} class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td class="py-2 px-4 border">{tim.posisi}</td>
                    <td class="py-2 px-4 border">{tim.namaTim}</td>
                    <td class="py-2 px-4 border">{tim.pembicara[0].skor}</td>
                    <td class="py-2 px-4 border">{tim.pembicara[1].skor}</td>
                    <td class="py-2 px-4 border font-medium">{tim.skorTim.toFixed(2)}</td>
                    <td class="py-2 px-4 border text-center">{tim.peringkat}</td>
                    <td class="py-2 px-4 border text-center font-bold">
                      <span class={`
                        px-3 py-1 rounded-full
                        ${tim.peringkat === 1 ? 'bg-green-100 text-green-800' : 
                          tim.peringkat === 2 ? 'bg-blue-100 text-blue-800' : 
                          tim.peringkat === 3 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {tim.vp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div class="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
            <h4 class="font-semibold mb-2">Penjelasan Hasil:</h4>
            <ol class="list-decimal pl-5 space-y-1">
              {hasilPerhitungan.map((tim, index) => (
                <li key={index}>
                  <strong>{tim.posisi}</strong> ({tim.namaTim}): 
                  Skor Tim = ({tim.pembicara[0].skor} + {tim.pembicara[1].skor}) / 2 = {tim.skorTim.toFixed(2)}, 
                  Peringkat #{tim.peringkat}, Victory Points: {tim.vp}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerhitunganVP;