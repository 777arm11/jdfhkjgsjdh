
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onStart, onReset, isPlaying }) => {
  return (
    <div className="flex justify-center w-full">
      {!isPlaying ? (
        <Button 
          onClick={onStart}
          className="w-64 h-16 text-xl bg-purple-600 hover:bg-purple-700 text-white"
        >
          Start Game
        </Button>
      ) : (
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-64 h-16 text-xl border-purple-400 text-purple-100 hover:bg-purple-800/50"
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default GameControls;
