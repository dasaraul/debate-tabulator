import React, { useState } from 'react';
import { hitungRataRataTim, tentukanVictoryPoints } from '../utils/scoreCalculations';

/**
 * Komponen untuk mendemonstrasikan perhitungan Victory Points dengan penanganan seri (tie)
 * Memungkinkan pengguna untuk mencoba metode penanganan seri yang berbeda
 * @author made by Tamaes
 */
const PerhitunganVPSeri = () => {
  const [metodeHandlingSeri, setMetodeHandlingSeri] = useState('split');
  const [skorPembicara, setSkorPembicara] = useState({
    OG: [77, 75], // Skor sama dengan OO (rata-rata 76)
    OO: [76, 76], // Skor sama dengan OG (rata-rata 76)
    CG: [74, 73], // Rata-rata 73.5
    CO: [72, 70]  // Rata-rata 71
  });
  
  const [hasilPerhitungan, setHasilPerhitungan] = useState(null);
  
  /**
   * Menghitung VP berdasarkan input user dengan penanganan seri
   * @author made by Tamaes
   */
  const hitungVP = () => {
    // Membuat array tim dari nilai input
    const timArray = [
      {
        posisi: "OG",
        namaTim: "UCDS",
        pembicara: [
          { nama: "Candra", skor: skorPembicara.OG[0] },
          { nama: "Steven", skor: skorPembicara.OG[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.OG[0], skorPembicara.OG[1])
      },
      {
        posisi: "OO",
        namaTim: "Marjorie",
        pembicara: [
          { nama: "Putriku", skor: skorPembicara.OO[0] },
          { nama: "Mayritza", skor: skorPembicara.OO[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.OO[0], skorPembicara.OO[1])
      },
      {
        posisi: "CG",
        namaTim: "Viva la Vida",
        pembicara: [
          { nama: "David", skor: skorPembicara.CG[0] },
          { nama: "Zhafa", skor: skorPembicara.CG[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.CG[0], skorPembicara.CG[1])
      },
      {
        posisi: "CO",
        namaTim: "Moonlight",
        pembicara: [
          { nama: "Ananda", skor: skorPembicara.CO[0] },
          { nama: "Qonita", skor: skorPembicara.CO[1] }
        ],
        skorTim: hitungRataRataTim(skorPembicara.CO[0], skorPembicara.CO[1])
      }
    ];
    
    // Tentukan Victory Points dengan metode yang dipilih
    const hasilDenganVP = tentukanVictoryPoints(timArray, { tieHandling: metodeHandlingSeri });
    setHasilPerhitungan(hasilDenganVP);
  };
  
  /**
   * Handler untuk perubahan nilai input skor pembicara
   * @author made by Tamaes
   */
  const handleSkorChange = (posisi, index, nilai) => {
    setSkorPembicara(prev => {
      const skorBaru = { ...prev };
      skorBaru[posisi][index] = parseFloat(nilai);
      return skorBaru;
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Penanganan Seri (Tie) dalam Perhitungan VP</h2>
      
      <div className="mb-6">
        <p className="mb-4">
          Dalam kompetisi debat, sering terjadi situasi di mana dua atau lebih tim memiliki skor tim yang sama (seri/tie).
          Ada beberapa metode yang bisa digunakan untuk menentukan peringkat dan Victory Points dalam kasus seri.
        </p>
        
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-6">
          <h3 className="font-semibold mb-2">Metode Penanganan Seri:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Split VP (Pembagian Rata VP)</strong>
              <p className="text-sm">
                Tim yang seri berbagi rata VP dari posisi yang mereka tempati.
                <br />Contoh: Jika tim A dan B seri di peringkat 1-2, masing-masing mendapat (3+2)/2 = 2.5 VP.
              </p>
            </li>
            <li>
              <strong>Tie-breaker (Pemecah Seri)</strong>
              <p className="text-sm">
                Menggunakan kriteria tambahan seperti skor pembicara tertinggi untuk memecah seri.
                <br />Contoh: Jika tim A dan B seri, tetapi tim A memiliki pembicara dengan skor 77 (lebih tinggi dari tim B dengan 76), maka tim A mendapat peringkat lebih tinggi.
              </p>
            </li>
          </ol>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Pilih Metode Penanganan Seri</h3>
        <div className="flex space-x-4 mb-6">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="tieHandling" 
              value="split" 
              checked={metodeHandlingSeri === 'split'}
              onChange={() => setMetodeHandlingSeri('split')}
              className="mr-2"
            />
            <span>Split VP (Pembagian Rata)</span>
          </label>
          
          <label className="flex items-center">
            <input 
              type="radio" 
              name="tieHandling" 
              value="tiebreaker" 
              checked={metodeHandlingSeri === 'tiebreaker'}
              onChange={() => setMetodeHandlingSeri('tiebreaker')}
              className="mr-2"
            />
            <span>Tie-breaker (Skor Pembicara Tertinggi)</span>
          </label>
        </div>
        
        <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
          <div className="font-medium mb-2">
            {metodeHandlingSeri === 'split' 
              ? 'Metode Split VP (Pembagian Rata)' 
              : 'Metode Tie-breaker (Skor Pembicara Tertinggi)'}
          </div>
          <p className="text-sm">
            {metodeHandlingSeri === 'split'
              ? 'Dalam contoh ini, tim OG dan OO memiliki skor tim yang sama (76.0). Dengan metode pembagian rata, mereka akan berbagi peringkat 1-2 dan masing-masing mendapatkan (3+2)/2 = 2.5 VP.'
              : 'Dalam contoh ini, tim OG dan OO memiliki skor tim yang sama (76.0). Dengan metode tie-breaker, tim OG menang karena memiliki pembicara dengan skor 77 (lebih tinggi dari skor tertinggi tim OO yaitu 76).'}
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Masukkan Skor Pembicara</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input untuk OG */}
          <div className="border p-4 rounded bg-blue-50">
            <h4 className="font-semibold mb-2">Opening Government (OG) - UCDS</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Candra (PM)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.OG[0]}
                  onChange={(e) => handleSkorChange('OG', 0, e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Steven (DPM)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.OG[1]}
                  onChange={(e) => handleSkorChange('OG', 1, e.target.value)}
                />
              </div>
              <div className="col-span-2 mt-2 bg-white p-2 rounded border">
                <span className="text-sm text-gray-600">Skor Tim: </span>
                <span className="font-medium">{((skorPembicara.OG[0] + skorPembicara.OG[1]) / 2).toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Input untuk OO */}
          <div className="border p-4 rounded bg-red-50">
            <h4 className="font-semibold mb-2">Opening Opposition (OO) - Marjorie</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Putriku (LO)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.OO[0]}
                  onChange={(e) => handleSkorChange('OO', 0, e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Mayritza (DLO)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.OO[1]}
                  onChange={(e) => handleSkorChange('OO', 1, e.target.value)}
                />
              </div>
              <div className="col-span-2 mt-2 bg-white p-2 rounded border">
                <span className="text-sm text-gray-600">Skor Tim: </span>
                <span className="font-medium">{((skorPembicara.OO[0] + skorPembicara.OO[1]) / 2).toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Input untuk CG */}
          <div className="border p-4 rounded bg-green-50">
            <h4 className="font-semibold mb-2">Closing Government (CG) - Viva la Vida</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">David (MG)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.CG[0]}
                  onChange={(e) => handleSkorChange('CG', 0, e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Zhafa (GW)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.CG[1]}
                  onChange={(e) => handleSkorChange('CG', 1, e.target.value)}
                />
              </div>
              <div className="col-span-2 mt-2 bg-white p-2 rounded border">
                <span className="text-sm text-gray-600">Skor Tim: </span>
                <span className="font-medium">{((skorPembicara.CG[0] + skorPembicara.CG[1]) / 2).toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Input untuk CO */}
          <div className="border p-4 rounded bg-yellow-50">
            <h4 className="font-semibold mb-2">Closing Opposition (CO) - Moonlight</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Ananda (MO)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.CO[0]}
                  onChange={(e) => handleSkorChange('CO', 0, e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Qonita (OW)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="90" 
                  className="w-full p-2 border rounded"
                  value={skorPembicara.CO[1]}
                  onChange={(e) => handleSkorChange('CO', 1, e.target.value)}
                />
              </div>
              <div className="col-span-2 mt-2 bg-white p-2 rounded border">
                <span className="text-sm text-gray-600">Skor Tim: </span>
                <span className="font-medium">{((skorPembicara.CO[0] + skorPembicara.CO[1]) / 2).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={hitungVP}
        >
          Hitung Victory Points
        </button>
      </div>
      
      {/* Hasil Perhitungan */}
      {hasilPerhitungan && (
        <div className="border p-6 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Hasil Perhitungan dengan {metodeHandlingSeri === 'split' ? 'Pembagian Rata VP' : 'Tie-breaker'}</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Posisi</th>
                  <th className="py-2 px-4 border">Tim</th>
                  <th className="py-2 px-4 border">Pembicara</th>
                  <th className="py-2 px-4 border">Skor Tim</th>
                  <th className="py-2 px-4 border">Peringkat</th>
                  <th className="py-2 px-4 border font-bold">Victory Points</th>
                  {metodeHandlingSeri === 'tiebreaker' && (
                    <th className="py-2 px-4 border">Tie-breaker</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {hasilPerhitungan.map((tim, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-4 border">{tim.posisi}</td>
                    <td className="py-2 px-4 border">{tim.namaTim}</td>
                    <td className="py-2 px-4 border">
                      <div className="space-y-1">
                        {tim.pembicara.map((p, idx) => (
                          <div key={idx} className="text-sm">
                            {p.nama}: <span className="font-medium">{p.skor}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 border font-medium">{tim.skorTim.toFixed(1)}</td>
                    <td className="py-2 px-4 border text-center">{tim.peringkat}</td>
                    <td className="py-2 px-4 border text-center font-bold">
                      <span className={`
                        px-3 py-1 rounded-full
                        ${typeof tim.peringkat === 'string' ? 'bg-purple-100 text-purple-800' : 
                          tim.peringkat === 1 ? 'bg-green-100 text-green-800' : 
                          tim.peringkat === 2 ? 'bg-blue-100 text-blue-800' : 
                          tim.peringkat === 3 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {tim.vp}
                      </span>
                    </td>
                    {metodeHandlingSeri === 'tiebreaker' && (
                      <td className="py-2 px-4 border text-sm">
                        {tim.statusSeri && 
                          <div className="text-gray-600">
                            Skor pembicara tertinggi: <span className="font-medium">
                              {Math.max(...tim.pembicara.map(p => p.skor))}
                            </span>
                          </div>
                        }
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
            <h4 className="font-semibold mb-2">Penjelasan Hasil:</h4>
            {metodeHandlingSeri === 'split' ? (
              <>
                <p className="mb-3">
                  Dengan metode <strong>Split VP (Pembagian Rata)</strong>, tim yang memiliki skor sama akan berbagi peringkat dan VP:
                </p>
                {hasilPerhitungan.filter(t => t.statusSeri).length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {hasilPerhitungan
                      .filter(t => t.statusSeri)
                      .map((tim, idx) => {
                        const timSeri = hasilPerhitungan.filter(t => t.peringkat === tim.peringkat);
                        if (idx === 0 || idx % timSeri.length === 0) {
                          return (
                            <li key={idx}>
                              <strong>Peringkat {tim.peringkat}</strong>: 
                              {timSeri.map(t => t.namaTim).join(' dan ')} seri dengan skor {tim.skorTim.toFixed(1)}
                              <div className="text-sm text-gray-600 mt-1">
                                ↳ VP dibagi rata: ({timSeri.map((_, i) => vpMapping[tim.peringkatAwal + i] || 0).join(' + ')}) / {timSeri.length} = {tim.vp}
                              </div>
                            </li>
                          );
                        }
                        return null;
                      }).filter(Boolean)
                    }
                  </ul>
                ) : (
                  <p className="italic text-gray-600">Tidak ada tim yang seri dalam contoh ini.</p>
                )}
              </>
            ) : (
              <>
                <p className="mb-3">
                  Dengan metode <strong>Tie-breaker</strong>, skor pembicara tertinggi digunakan untuk memecah seri:
                </p>
                {hasilPerhitungan.filter(t => t.statusSeri !== undefined).length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {hasilPerhitungan
                      .filter(t => t.peringkatSebelumTiebreaker !== undefined)
                      .map((tim, idx) => {
                        const timSeri = hasilPerhitungan.filter(t => t.peringkatSebelumTiebreaker === tim.peringkatSebelumTiebreaker);
                        if (idx === 0 || idx % timSeri.length === 0) {
                          return (
                            <li key={idx}>
                              <strong>Seri pada peringkat {tim.peringkatSebelumTiebreaker}</strong>: 
                              {timSeri.map(t => ` ${t.namaTim} (${Math.max(...t.pembicara.map(p => p.skor))})`).join(' dan ')} memiliki skor tim yang sama ({tim.skorTim.toFixed(1)})
                              <div className="text-sm text-gray-600 mt-1">
                                ↳ Diputuskan dengan skor pembicara tertinggi, menghasilkan peringkat terpisah
                              </div>
                            </li>
                          );
                        }
                        return null;
                      }).filter(Boolean)
                    }
                  </ul>
                ) : (
                  <p className="italic text-gray-600">Tidak ada tim yang seri dalam contoh ini.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Mapping VP berdasarkan peringkat untuk referensi
const vpMapping = { 1: 3, 2: 2, 3: 1, 4: 0 };

export default PerhitunganVPSeri;