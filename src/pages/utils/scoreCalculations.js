/**
 * Menghitung rata-rata skor untuk sebuah tim berdasarkan skor dua speaker
 * Implementasi rumus AVERAGE di Excel
 */
export const calculateTeamAverage = (speaker1Score, speaker2Score) => {
    return (speaker1Score + speaker2Score) / 2;
  };
  
  /**
   * Menghitung rata-rata skor dari array skor
   * Implementasi rumus AVERAGE di Excel
   */
  export const calculateAverage = (scores) => {
    if (!scores || scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return sum / scores.length;
  };
  
  /**
   * Menghitung total skor untuk final round
   * Implementasi dari SUM(G5:G10)/3 di file Excel
   */
  export const calculateRoundTotal = (teams) => {
    // Ini mirip dengan SUM(G5:G10)/3 di Excel
    const validTeams = teams.filter(team => team.score > 0);
    if (validTeams.length === 0) return 0;
    
    const sum = validTeams.reduce((acc, team) => acc + team.score, 0);
    return sum / (validTeams.length / 2); // Dibagi jumlah matchup (jumlah tim / 2)
  };
  
  /**
   * Mengurutkan tim berdasarkan skor dan memberikan Victory Points
   * Berdasarkan peringkat
   */
  export const assignVictoryPoints = (teams) => {
    // Mengurutkan tim berdasarkan skor
    const sortedTeams = [...teams].sort((a, b) => b.teamScore - a.teamScore);
    
    // Menentukan Victory Points (VP) berdasarkan peringkat
    return sortedTeams.map((team, index) => {
      let vp = 0;
      if (index === 0) vp = 3; // Peringkat 1: 3 poin
      else if (index === 1) vp = 2; // Peringkat 2: 2 poin
      else if (index === 2) vp = 1; // Peringkat 3: 1 poin
      // Peringkat 4: 0 poin
      
      return {
        ...team,
        rank: index + 1,
        vp
      };
    });
  };
  
  /**
   * Menghitung skor Best Speaker
   * Implementasi perhitungan berdasarkan file Excel BEST SPEAKER
   */
  export const calculateBestSpeaker = (speakers) => {
    // Menghitung total skor speaker dari semua ronde
    return speakers.map(speaker => {
      const totalScore = speaker.scores.reduce((sum, scoreItem) => {
        // Pastikan bahwa itu adalah angka
        const score = parseFloat(scoreItem) || 0;
        return sum + score;
      }, 0);
      
      return {
        ...speaker,
        totalScore,
        average: totalScore / speaker.scores.filter(score => score > 0).length
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  };
  
  /**
   * Mengumpulkan dan menghitung Victory Points semua tim
   */
  export const calculateTeamRankings = (rounds) => {
    // Mapping untuk menampung Victory Points setiap tim
    const teamVPs = {};
    
    // Iterasi melalui setiap ronde dan mengumpulkan VP
    rounds.forEach(round => {
      round.results.forEach(team => {
        const teamKey = team.teamName;
        
        if (!teamVPs[teamKey]) {
          teamVPs[teamKey] = {
            team: teamKey,
            university: team.university,
            vps: [],
            totalVP: 0
          };
        }
        
        // Menambahkan VP dari ronde ini
        teamVPs[teamKey].vps.push({
          round: round.round,
          vp: team.vp
        });
        
        // Update total VP
        teamVPs[teamKey].totalVP += team.vp;
      });
    });
    
    // Konversi ke array dan urutkan berdasarkan total VP
    return Object.values(teamVPs)
      .sort((a, b) => b.totalVP - a.totalVP)
      .map((team, index) => ({
        ...team,
        rank: index + 1
      }));
  };
  
  /**
   * Menghasilkan tabel data Best Speaker dengan format seperti di Excel
   */
  export const generateBestSpeakerTable = (rounds) => {
    // Mapping untuk menampung data speaker
    const speakerData = {};
    
    // Iterasi melalui setiap ronde dan kumpulkan data speaker
    rounds.forEach(round => {
      round.results.forEach(team => {
        team.speakers.forEach(speaker => {
          const speakerKey = `${speaker.name}_${team.teamName}`;
          
          if (!speakerData[speakerKey]) {
            speakerData[speakerKey] = {
              name: speaker.name,
              team: team.teamName,
              university: team.university,
              scores: {},
              totalScore: 0
            };
          }
          
          // Tambahkan skor untuk ronde ini
          speakerData[speakerKey].scores[round.round] = speaker.score;
          
          // Update total skor
          speakerData[speakerKey].totalScore += speaker.score;
        });
      });
    });
    
    // Mengurutkan berdasarkan total skor
    return Object.values(speakerData)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((speaker, index) => ({
        ...speaker,
        rank: index + 1,
        // Menghitung rata-rata
        average: speaker.totalScore / Object.keys(speaker.scores).length
      }));
  };