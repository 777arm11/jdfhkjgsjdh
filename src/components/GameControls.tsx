import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = React.memo(({ onStart, onReset, isPlaying }) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex gap-4 md:bottom-4">
      {!isPlaying ? (
        <Button onClick={onStart} className="bg-primary hover:bg-primary/90">
          Start Game
        </Button>
      ) : (
        <Button onClick={onReset} variant="outline">
          Reset
        </Button>
      )}
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls;