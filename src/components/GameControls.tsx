import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onStart, onReset, isPlaying }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
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
};

export default GameControls;