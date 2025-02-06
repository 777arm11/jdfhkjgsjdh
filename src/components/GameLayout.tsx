
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
  if (!telegramValidated) {
    return (
      <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-game-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-game-secondary border-game-accent">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <CardTitle className="text-2xl font-pixel text-white text-center">
                Access Required
              </CardTitle>
            </div>
            <CardDescription className="text-center text-base font-pixel text-white/80">
              Please open this game through Telegram to play and earn coins!
            </CardDescription>
          </CardHeader>
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
