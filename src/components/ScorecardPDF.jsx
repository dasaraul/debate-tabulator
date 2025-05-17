import React from 'react';

const ScorecardPDF = ({ round, room, motion, judge, teams }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow max-w-3xl mx-auto border-2 border-gray-300 print:border-none">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">British Parliamentary Debate</h1>
        <h2 className="text-xl">{round} - {room}</h2>
      </div>
      
      <div className="border-b pb-4 mb-6">
        <div className="text-sm text-gray-600">Motion:</div>
        <div className="font-medium">{motion}</div>
      </div>
      
      <div className="mb-6">
        <div className="text-sm text-gray-600">Judge:</div>
        <div className="font-medium">{judge}</div>
      </div>
      
      <div className="space-y-8">
        {['OG', 'OO', 'CG', 'CO'].map((position, index) => (
          <div key={position} className="border p-4 rounded">
            <h3 className="font-bold text-lg mb-2">{position}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600">Team Name</label>
                <div className="border p-2 rounded">{teams[index]?.teamName || ''}</div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600">University</label>
                <div className="border p-2 rounded">{teams[index]?.university || ''}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <label className="block text-sm text-gray-600">Speaker 1</label>
                  <div className="border p-2 rounded">{teams[index]?.speakers?.[0]?.name || ''}</div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600">Score</label>
                  <div className="border p-2 rounded font-bold">{teams[index]?.speakers?.[0]?.score || ''}</div>
                </div>
              </div>
              
              <div>
                <div className="mb-2">
                  <label className="block text-sm text-gray-600">Speaker 2</label>
                  <div className="border p-2 rounded">{teams[index]?.speakers?.[1]?.name || ''}</div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600">Score</label>
                  <div className="border p-2 rounded font-bold">{teams[index]?.speakers?.[1]?.score || ''}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Team Score</label>
              <div className="border p-2 rounded font-bold">{teams[index]?.teamScore?.toFixed(2) || ''}</div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Ranking</label>
              <div className="border p-2 rounded font-bold">{teams[index]?.rank || ''}</div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Victory Points</label>
              <div className="border p-2 rounded font-bold">{teams[index]?.vp || ''}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-600">Date</div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600">Judge Signature</div>
          <div className="mt-8 w-48 border-t border-black"></div>
        </div>
      </div>
      
      <div className="text-center mt-12 text-sm text-gray-500">
        <div>Debate Tabulator System</div>
        <div>BP Format</div>
      </div>
    </div>
  );
};

export default ScorecardPDF;