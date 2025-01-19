import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = React.memo(({ onStart, onReset, isPlaying }) => {
  return (
    <div className="flex justify-center w-full mb-20">
      {!isPlaying ? (
        <Button 
          onClick={onStart} 
          className="w-32 h-12 text-lg font-medium bg-primary hover:bg-primary/90"
        >
          Start Game
        </Button>
      ) : (
        <Button 
          onClick={onReset} 
          variant="outline"
          className="w-32 h-12 text-lg font-medium"
        >
          Reset
        </Button>
      )}
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls;