import React from 'react';

/**
 * Komponen untuk menampilkan scorecard debat dalam format PDF
 * @author made by Tamaes
 */
const ScorecardPDF = ({ round, room, motion, judge, teams }) => {
  return (
    <div class="p-8 bg-white rounded-lg shadow max-w-3xl mx-auto border-2 border-gray-300 print:border-none">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">British Parliamentary Debate</h1>
        <h2 class="text-xl">{round} - {room}</h2>
      </div>
      
      <div class="border-b pb-4 mb-6">
        <div class="text-sm text-gray-600">Motion:</div>
        <div class="font-medium">{motion}</div>
      </div>
      
      <div class="mb-6">
        <div class="text-sm text-gray-600">Judge:</div>
        <div class="font-medium">{judge}</div>
      </div>
      
      <div class="space-y-8">
        {['OG', 'OO', 'CG', 'CO'].map((position, index) => (
          <div key={position} class="border p-4 rounded">
            <h3 class="font-bold text-lg mb-2">{position}</h3>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm text-gray-600">Team Name</label>
                <div class="border p-2 rounded">{teams[index]?.teamName || ''}</div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-600">University</label>
                <div class="border p-2 rounded">{teams[index]?.university || ''}</div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="mb-2">
                  <label class="block text-sm text-gray-600">Speaker 1</label>
                  <div class="border p-2 rounded">{teams[index]?.speakers?.[0]?.name || ''}</div>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-600">Score</label>
                  <div class="border p-2 rounded font-bold">{teams[index]?.speakers?.[0]?.score || ''}</div>
                </div>
              </div>
              
              <div>
                <div class="mb-2">
                  <label class="block text-sm text-gray-600">Speaker 2</label>
                  <div class="border p-2 rounded">{teams[index]?.speakers?.[1]?.name || ''}</div>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-600">Score</label>
                  <div class="border p-2 rounded font-bold">{teams[index]?.speakers?.[1]?.score || ''}</div>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm text-gray-600">Team Score</label>
              <div class="border p-2 rounded font-bold">{teams[index]?.teamScore?.toFixed(2) || ''}</div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm text-gray-600">Ranking</label>
              <div class="border p-2 rounded font-bold">{teams[index]?.rank || ''}</div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm text-gray-600">Victory Points</label>
              <div class="border p-2 rounded font-bold">{teams[index]?.vp || ''}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div class="mt-8 flex justify-between items-center">
        <div>
          <div class="text-sm text-gray-600">Date</div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
        
        <div>
          <div class="text-sm text-gray-600">Judge Signature</div>
          <div class="mt-8 w-48 border-t border-black"></div>
        </div>
      </div>
      
      <div class="text-center mt-12 text-sm text-gray-500">
        <div>Debate Tabulator System</div>
        <div>BP Format</div>
      </div>
    </div>
  );
};

export default ScorecardPDF;