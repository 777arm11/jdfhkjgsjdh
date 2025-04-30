
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
          className="w-64 h-20 text-xl font-pixel bg-purple-700 hover:bg-purple-600 text-white border-4 border-purple-300 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse shadow-lg"
        >
          Start Game
        </Button>
      ) : (
        <Button 
          onClick={onReset} 
          variant="outline"
          className="w-64 h-20 text-xl font-pixel bg-purple-600 hover:bg-purple-700 text-white border-4 border-purple-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Reset
        </Button>
      )}
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls;
