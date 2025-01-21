import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = React.memo(({ onStart, onReset, isPlaying }) => {
  return (
    <div className="flex justify-center w-full mb-24">
      {!isPlaying ? (
        <Button 
          onClick={onStart} 
          className="w-48 h-16 text-lg font-pixel bg-game-primary hover:bg-game-secondary text-game-text border-2 border-game-text transition-colors"
        >
          Start Game
        </Button>
      ) : (
        <Button 
          onClick={onReset} 
          variant="outline"
          className="w-48 h-16 text-lg font-pixel bg-game-secondary hover:bg-game-primary text-game-text border-2 border-game-text transition-colors"
        >
          Reset
        </Button>
      )}
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls;