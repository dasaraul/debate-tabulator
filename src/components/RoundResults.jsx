import React from 'react';

const RoundResults = ({ roundData }) => {
  if (!roundData || !roundData.results) {
    return <div>Tidak ada data untuk ditampilkan</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold">{roundData.round}</h3>
          <div className="text-gray-600 mt-1">Room: {roundData.room}</div>
        </div>
        
        <div className="bg-gray-100 p-2 rounded">
          <div className="text-sm font-medium">Tanggal: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      <div className="border-t border-b py-4 mb-6">
        <div className="text-sm text-gray-600 mb-1">Motion:</div>
        <div className="text-lg">{roundData.motion}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roundData.results.map((team, index) => (
          <div 
            key={index} 
            className={`
              border rounded-lg p-4 
              ${team.rank === 1 ? 'bg-yellow-50 border-yellow-200' : 
                team.rank === 2 ? 'bg-gray-50 border-gray-200' : 
                team.rank === 3 ? 'bg-amber-50 border-amber-200' : 
                'bg-white border-gray-200'}
            `}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm text-gray-600">{team.position}</div>
                <div className="font-bold text-lg">{team.teamName}</div>
                <div className="text-sm">{team.university}</div>
              </div>
              
              <div className={`
                rounded-full w-8 h-8 flex items-center justify-center font-bold
                ${team.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 
                  team.rank === 2 ? 'bg-gray-400 text-white' : 
                  team.rank === 3 ? 'bg-amber-600 text-white' : 
                  'bg-gray-200 text-gray-700'}
              `}>
                {team.rank}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {team.speakers.map((speaker, idx) => (
                <div key={idx} className="border-b pb-2">
                  <div className="text-sm text-gray-600">{speaker.position}</div>
                  <div className="font-medium">{speaker.name}</div>
                  <div className="font-bold text-lg">{speaker.score}</div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div>
                <div className="text-sm text-gray-600">Team Score</div>
                <div className="font-bold text-xl">{team.teamScore.toFixed(2)}</div>
              </div>
              
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                VP: {team.vp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundResults;