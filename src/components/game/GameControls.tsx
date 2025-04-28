
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = React.memo(({ onStart, onReset, isPlaying }) => {
  return (
    <div className="flex justify-center w-full mb-12">
      {!isPlaying ? (
        <Button 
          onClick={onStart} 
          className="w-64 h-20 text-xl font-pixel bg-game-primary hover:bg-game-secondary text-game-text border-4 border-game-text transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse shadow-lg"
        >
          Start Game
        </Button>
      ) : (
        <Button 
          onClick={onReset} 
          variant="outline"
          className="w-64 h-20 text-xl font-pixel bg-game-secondary hover:bg-game-primary text-game-text border-4 border-game-text transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Reset
        </Button>
      )}
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls;
