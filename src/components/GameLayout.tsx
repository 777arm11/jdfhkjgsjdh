
import React from 'react';
import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface GameLayoutProps {
  score: number;
  highScore: number;
  coins: number;
  isPlaying: boolean;
  onScoreUpdate: (newScore: number) => void;
  onStart: () => void;
  onReset: () => void;
  telegramValidated?: boolean;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  score,
  highScore,
  coins,
  isPlaying,
  onScoreUpdate,
  onStart,
  onReset,
  telegramValidated = false
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const telegramId = urlParams.get('id');
  
  if (!telegramValidated && !telegramId) {
    return (
      <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-game-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-game-secondary border-game-accent">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <CardTitle className="text-2xl font-pixel text-white text-center">
                Test Mode
              </CardTitle>
            </div>
            <CardDescription className="text-center text-base font-pixel text-white/80">
              You're playing in test mode. Progress and coins won't be saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-4 px-4 py-2 bg-game-accent text-white rounded-md font-pixel hover:bg-game-accent/80 transition-colors"
            >
              Start Playing
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-game-primary">
      <div className="max-w-xl mx-auto h-full px-4 py-6 flex flex-col gap-6">
        <ScoreBoard currentScore={score} highScore={highScore} coins={coins} />
        <div className="flex-1 relative">
          <GameArea 
            isPlaying={isPlaying} 
            score={score} 
            onScoreUpdate={onScoreUpdate} 
          />
        </div>
        <div className="mb-16">
          <GameControls
            onStart={onStart}
            onReset={onReset}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
