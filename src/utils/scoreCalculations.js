/**
 * Menghitung rata-rata skor untuk sebuah tim berdasarkan skor dua pembicara
 * Implementasi rumus AVERAGE di Excel
 */
export const hitungRataRataTim = (skorPembicara1, skorPembicara2) => {
    return (skorPembicara1 + skorPembicara2) / 2;
  };
  
  /**
   * Menghitung rata-rata skor dari array skor
   * Implementasi rumus AVERAGE di Excel
   */
  export const hitungRataRata = (skorArray) => {
    if (!skorArray || skorArray.length === 0) return 0;
    const jumlah = skorArray.reduce((acc, skor) => acc + skor, 0);
    return jumlah / skorArray.length;
  };
  
  /**
   * Menentukan Victory Points berdasarkan peringkat, termasuk penanganan seri (tie)
   * @param {Array} timArray - Array tim yang akan dihitung VP-nya
   * @param {Object} options - Opsi untuk penanganan seri: 'split' (default) atau 'tiebreaker'
   */
  export const tentukanVictoryPoints = (timArray, options = { tieHandling: 'split' }) => {
    const { tieHandling } = options;
    
    // Mengurutkan tim berdasarkan skor
    const timTerurut = [...timArray].sort((a, b) => b.skorTim - a.skorTim);
    
    // Mapping VP berdasarkan peringkat (1-based index)
    const vpMapping = { 1: 3, 2: 2, 3: 1, 4: 0 };
    
    // Array untuk hasil final
    const hasilFinal = [];
    
    // Temp array untuk menyimpan tim dengan skor sama
    let timSekor = [];
    let peringkatSaatIni = 1;
    
    // Proses setiap tim dalam urutan berdasarkan skor
    for (let i = 0; i < timTerurut.length; i++) {
      // Tambahkan tim saat ini ke grup timSekor
      timSekor.push(timTerurut[i]);
      
      // Jika ini tim terakhir atau tim berikutnya memiliki skor berbeda
      if (i === timTerurut.length - 1 || timTerurut[i].skorTim !== timTerurut[i + 1].skorTim) {
        // Peringkat untuk semua tim dalam grup seri ini
        const jumlahTimSeri = timSekor.length;
        
        if (jumlahTimSeri === 1 || tieHandling === 'standard') {
          // Jika hanya satu tim atau menggunakan standard ranking
          const tim = timSekor[0];
          hasilFinal.push({
            ...tim,
            peringkat: peringkatSaatIni,
            vp: vpMapping[peringkatSaatIni] || 0
          });
        } else if (tieHandling === 'split') {
          // Jika beberapa tim seri, bagi rata VP
          // Peringkat: 1-2, 3-4, dst
          const totalVP = Array.from(
            { length: jumlahTimSeri }, 
            (_, idx) => vpMapping[peringkatSaatIni + idx] || 0
          ).reduce((sum, vp) => sum + vp, 0);
          
          const vpPerTim = totalVP / jumlahTimSeri;
          
          // Peringkat untuk ditampilkan: "1-2", "3-4", dst
          const peringkatDisplay = jumlahTimSeri > 1 
            ? `${peringkatSaatIni}-${peringkatSaatIni + jumlahTimSeri - 1}` 
            : peringkatSaatIni.toString();
          
          // Tambahkan setiap tim dengan VP yang sama
          timSekor.forEach(tim => {
            hasilFinal.push({
              ...tim,
              peringkat: peringkatDisplay,
              peringkatAwal: peringkatSaatIni,
              peringkatAkhir: peringkatSaatIni + jumlahTimSeri - 1,
              statusSeri: true,
              jumlahTimSeri,
              vp: vpPerTim
            });
          });
        } else if (tieHandling === 'tiebreaker') {
          // Gunakan tiebreaker - misalnya skor pembicara tertinggi
          const timDenganTiebreaker = timSekor.map(tim => {
            // Temukan skor pembicara tertinggi untuk masing-masing tim
            const skorPembicaraTertinggi = Math.max(...tim.pembicara.map(p => p.skor));
            return { ...tim, skorTiebreaker: skorPembicaraTertinggi };
          });
          
          // Urutkan tim berdasarkan tiebreaker
          timDenganTiebreaker.sort((a, b) => b.skorTiebreaker - a.skorTiebreaker);
          
          // Tentukan VP berdasarkan urutan tiebreaker
          timDenganTiebreaker.forEach((tim, idx) => {
            const peringkatTiebreaker = peringkatSaatIni + idx;
            hasilFinal.push({
              ...tim,
              peringkat: peringkatTiebreaker,
              peringkatSebelumTiebreaker: peringkatSaatIni,
              statusSeri: idx > 0 ? true : false, // Hanya seri jika bukan peringkat pertama
              metodeBreaker: 'Skor pembicara tertinggi',
              vp: vpMapping[peringkatTiebreaker] || 0
            });
          });
        }
        
        // Update peringkat untuk grup berikutnya
        peringkatSaatIni += jumlahTimSeri;
        
        // Reset grup tim sekor
        timSekor = [];
      }
    }
    
    return hasilFinal;
  };
  
  /**
   * Contoh data perhitungan VP dengan seri (tie)
   */
  export const contohPerhitunganVPDenganSeri = {
    round: "BP 1, Ruangan A (dengan Seri)",
    teams: [
      { position: "OG", teamName: "UCDS", teamScore: 76.0, rank: "1-2", vp: 2.5 },
      { position: "OO", teamName: "Marjorie", teamScore: 76.0, rank: "1-2", vp: 2.5 },
      { position: "CG", teamName: "Viva la Vida", teamScore: 73.5, rank: "3", vp: 1 },
      { position: "CO", teamName: "Moonlight", teamScore: 71.0, rank: "4", vp: 0 }
    ],
    description: "Dalam contoh ini, tim OG dan OO memiliki skor tim yang sama (76.0), sehingga mereka berbagi peringkat 1-2 dan masing-masing mendapatkan (3+2)/2 = 2.5 VP."
  };
  
  /**
   * Contoh data perhitungan VP dengan metode tiebreaker
   */
  export const contohPerhitunganVPDenganTiebreaker = {
    round: "BP 2, Ruangan B (dengan Tiebreaker)",
    teams: [
      { 
        position: "OG", 
        teamName: "UCDS", 
        teamScore: 76.0, 
        speakers: [
          { name: "Candra", score: 77 },
          { name: "Steven", score: 75 }
        ],
        highestSpeakerScore: 77,
        rank: "1", 
        vp: 3,
        note: "Menang tiebreaker karena memiliki skor pembicara tertinggi (77)"
      },
      { 
        position: "OO", 
        teamName: "Marjorie", 
        teamScore: 76.0, 
        speakers: [
          { name: "Putriku", score: 76 },
          { name: "Mayritza", score: 76 }
        ],
        highestSpeakerScore: 76,
        rank: "2", 
        vp: 2,
        note: "Kalah tiebreaker karena skor pembicara tertinggi lebih rendah (76)"
      },
      { 
        position: "CG", 
        teamName: "Viva la Vida", 
        teamScore: 73.5, 
        rank: "3", 
        vp: 1 
      },
      { 
        position: "CO", 
        teamName: "Moonlight", 
        teamScore: 71.0, 
        rank: "4", 
        vp: 0 
      }
    ],
    description: "Dalam contoh ini, tim OG dan OO memiliki skor tim yang sama (76.0), tetapi UCDS menang karena memiliki skor pembicara tertinggi (77 vs 76)."
  };
  
  /**
   * Menghitung total Victory Points dari beberapa ronde
   */
  export const hitungTotalVP = (timArray, rondeArray) => {
    // Mapping untuk menyimpan VP per tim
    const timVPMapping = {};
    
    // Inisialisasi mapping
    timArray.forEach(tim => {
      timVPMapping[tim.namaTim] = {
        namaTim: tim.namaTim,
        universitas: tim.universitas,
        vpPerRonde: {},
        totalVP: 0
      };
    });
    
    // Mengumpulkan VP per ronde
    rondeArray.forEach(ronde => {
      const { nama, hasil } = ronde;
      
      hasil.forEach(hasilTim => {
        const { namaTim, vp } = hasilTim;
        
        if (timVPMapping[namaTim]) {
          timVPMapping[namaTim].vpPerRonde[nama] = vp;
          timVPMapping[namaTim].totalVP += vp;
        }
      });
    });
    
    // Konversi mapping ke array dan urutkan berdasarkan total VP
    return Object.values(timVPMapping)
      .sort((a, b) => {
        // Jika totalVP sama, gunakan tiebreaker
        if (b.totalVP === a.totalVP) {
          // Implementasikan tiebreaker sesuai kebutuhan
          // Misal: total skor pembicara
          return 0; // Sementara tidak ada tiebreaker
        }
        return b.totalVP - a.totalVP;
      })
      .map((tim, idx) => ({
        ...tim,
        peringkat: idx + 1
      }));
  };
  
  /**
   * Perhitungan untuk Tie-breaking Methods
   */
  export const tieBreakingMethods = {
    /**
     * Method 1: Skor pembicara tertinggi
     */
    highestSpeakerScore: (tim) => {
      return Math.max(...tim.pembicara.map(p => p.skor));
    },
    
    /**
     * Method 2: Total skor pembicara
     */
    totalSpeakerScore: (tim) => {
      return tim.pembicara.reduce((sum, p) => sum + p.skor, 0);
    },
    
    /**
     * Method 3: Margin kemenangan (selisih dengan tim peringkat di bawahnya)
     */
    winMargin: (tim, timArray) => {
      // Urutkan tim berdasarkan skor
      const timTerurut = [...timArray].sort((a, b) => b.skorTim - a.skorTim);
      const timIndex = timTerurut.findIndex(t => t.namaTim === tim.namaTim);
      
      // Jika tim terakhir, gunakan selisih dengan tim di atasnya
      if (timIndex === timTerurut.length - 1) {
        return 0;
      }
      
      // Hitung selisih dengan tim di bawahnya
      return tim.skorTim - timTerurut[timIndex + 1].skorTim;
    }
  };