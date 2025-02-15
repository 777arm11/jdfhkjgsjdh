
import React from 'react';

interface CountdownTimerProps {
  countdown: number | null;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown }) => {
  if (countdown === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300">
      <div className="text-8xl font-bold text-white animate-bounce shadow-lg rounded-full bg-purple-500/50 w-40 h-40 flex items-center justify-center transform transition-all duration-300">
        {countdown}
      </div>
    </div>
  );
};

export default CountdownTimer;
