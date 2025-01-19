import React from 'react';

interface CountdownTimerProps {
  countdown: number | null;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown }) => {
  if (countdown === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-6xl font-bold text-primary animate-bounce">
        {countdown}
      </div>
    </div>
  );
};

export default CountdownTimer;