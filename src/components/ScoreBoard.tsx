
import React from 'react';
import { Coins, Users } from 'lucide-react';
import { useGlobalCoins } from '@/contexts/GlobalCoinsContext';

interface ScoreBoardProps {
  coins: number;
  activePlayers?: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ coins, activePlayers }) => {
  const { totalCoins } = useGlobalCoins();
  const percentUsed = totalCoins ? (totalCoins / 5000000000) * 100 : 0;
  const coinsRemainingFormatted = (5000000000 - totalCoins).toLocaleString();

  return (
    <div className="w-full px-4 py-2 bg-game-secondary rounded-lg shadow-lg border-2 border-game-accent">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Coins className="h-5 w-5 text-yellow-400" />
          <h2 className="text-lg font-pixel text-white">
            <span className="text-yellow-400">{coins.toLocaleString()}</span> Coins
          </h2>
        </div>
        
        {activePlayers !== undefined && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-game-accent/30">
            <Users className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-pixel text-purple-300">{activePlayers} Online</span>
          </div>
        )}
        
        <div className="flex flex-col w-full sm:w-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-pixel text-white/70">Global Pool:</span>
            <span className="text-xs font-pixel text-white/70">{percentUsed.toFixed(2)}% Used</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
          <div className="text-xs font-pixel text-white/50 text-right mt-1">
            {coinsRemainingFormatted} coins remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
