// src/utils/hitungSkor.js
// Fungsi-fungsi utilitas untuk perhitungan skor, mirip dengan rumus Excel

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
 * Menghitung total skor untuk putaran final
 * Implementasi dari SUM(G5:G10)/3 di file Excel
 */
export const hitungTotalRonde = (timArray) => {
  // Ini mirip dengan SUM(G5:G10)/3 di Excel
  const timValid = timArray.filter(tim => tim.skor > 0);
  if (timValid.length === 0) return 0;
  
  const jumlah = timValid.reduce((acc, tim) => acc + tim.skor, 0);
  return jumlah / (timValid.length / 2); // Dibagi jumlah matchup (jumlah tim / 2)
};

/**
 * Mengurutkan tim berdasarkan skor dan memberikan Victory Points
 * Berdasarkan peringkat
 */
export const tentukanVictoryPoints = (timArray) => {
  // Mengurutkan tim berdasarkan skor
  const timTerurut = [...timArray].sort((a, b) => b.skorTim - a.skorTim);
  
  // Menentukan Victory Points (VP) berdasarkan peringkat
  return timTerurut.map((tim, index) => {
    let vp = 0;
    if (index === 0) vp = 3; // Peringkat 1: 3 poin
    else if (index === 1) vp = 2; // Peringkat 2: 2 poin
    else if (index === 2) vp = 1; // Peringkat 3: 1 poin
    // Peringkat 4: 0 poin
    
    return {
      ...tim,
      peringkat: index + 1,
      vp
    };
  });
};

/**
 * Menghitung skor Best Speaker
 * Implementasi perhitungan berdasarkan file Excel BEST SPEAKER
 */
export const hitungBestSpeaker = (pembicaraArray) => {
  // Menghitung total skor pembicara dari semua ronde
  return pembicaraArray.map(pembicara => {
    const totalSkor = pembicara.skorArray.reduce((jumlah, skorItem) => {
      // Pastikan bahwa itu adalah angka
      const skor = parseFloat(skorItem) || 0;
      return jumlah + skor;
    }, 0);
    
    return {
      ...pembicara,
      totalSkor,
      rataRata: totalSkor / pembicara.skorArray.filter(skor => skor > 0).length
    };
  }).sort((a, b) => b.totalSkor - a.totalSkor);
};

/**
 * Mengumpulkan dan menghitung Victory Points semua tim
 */
export const hitungPeringkatTim = (rondeArray) => {
  // Mapping untuk menampung Victory Points setiap tim
  const timVP = {};
  
  // Iterasi melalui setiap ronde dan mengumpulkan VP
  rondeArray.forEach(ronde => {
    ronde.hasil.forEach(tim => {
      const kunciTim = tim.namaTim;
      
      if (!timVP[kunciTim]) {
        timVP[kunciTim] = {
          tim: kunciTim,
          universitas: tim.universitas,
          vpArray: [],
          totalVP: 0
        };
      }
      
      // Menambahkan VP dari ronde ini
      timVP[kunciTim].vpArray.push({
        ronde: ronde.ronde,
        vp: tim.vp
      });
      
      // Update total VP
      timVP[kunciTim].totalVP += tim.vp;
    });
  });
  
  // Konversi ke array dan urutkan berdasarkan total VP
  return Object.values(timVP)
    .sort((a, b) => b.totalVP - a.totalVP)
    .map((tim, index) => ({
      ...tim,
      peringkat: index + 1
    }));
};

/**
 * Contoh data perhitungan Victory Points
 * Untuk penggunaan demonstrasi
 */
export const contohPerhitunganVP = {
  round: "BP 1, Ruangan A",
  teams: [
    { position: "OG", teamName: "UCDS", teamScore: 76.5, rank: 1, vp: 3 },
    { position: "OO", teamName: "Marjorie", teamScore: 74.0, rank: 2, vp: 2 },
    { position: "CG", teamName: "Viva la Vida", teamScore: 73.5, rank: 3, vp: 1 },
    { position: "CO", teamName: "Moonlight", teamScore: 71.0, rank: 4, vp: 0 }
  ],
  perhitungan: [
    {
      step: "Langkah 1: Menghitung Skor Tim",
      description: "Skor tim dihitung sebagai rata-rata dari skor kedua pembicara dalam tim.",
      formula: "Skor Tim = (Skor Pembicara 1 + Skor Pembicara 2) / 2",
      example: "UCDS: (77 + 76) / 2 = 76.5"
    },
    {
      step: "Langkah 2: Mengurutkan Tim Berdasarkan Skor",
      description: "Tim diurutkan berdasarkan skor tim, dari tertinggi ke terendah.",
      formula: "Sort(TimArray, SkorTim, Descending)",
      example: "Hasil: UCDS (76.5) > Marjorie (74.0) > Viva la Vida (73.5) > Moonlight (71.0)"
    },
    {
      step: "Langkah 3: Menentukan Peringkat dan VP",
      description: "Victory Points diberikan berdasarkan peringkat tim.",
      formula: "Peringkat 1: 3 VP, Peringkat 2: 2 VP, Peringkat 3: 1 VP, Peringkat 4: 0 VP",
      example: "UCDS (Peringkat 1): 3 VP, Marjorie (Peringkat 2): 2 VP, dst."
    }
  ]
};

// Contoh data skor dari Excel
export const contohDataSkor = [
  {
    ronde: "BP 1",
    ruangan: "Room A",
    mosi: "This House believes that global green momentum cannot be achieved without Bipartisan Political Commitment to renewable energy innovation",
    hasil: [
      {
        posisi: "OG",
        namaTim: "UCDS",
        universitas: "Universitas Ciputra Surabaya",
        pembicara: [
          { posisi: "PM", nama: "Candra Giga Kharisma", skor: 76 },
          { posisi: "DPM", nama: "Steven Adi Santoso", skor: 76 }
        ],
        skorTim: 76,
        peringkat: 1,
        vp: 3
      },
      // Data tim lainnya untuk ronde ini
    ]
  },
  // Data ronde lainnya
];