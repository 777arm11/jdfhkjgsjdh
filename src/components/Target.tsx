import React from 'react';
import { cn } from '@/lib/utils';

interface TargetProps {
  position: { x: number; y: number };
  onClick: () => void;
  isHit: boolean;
  type: 'normal' | 'bonus' | 'speed';
  points: number;
}

const Target: React.FC<TargetProps> = React.memo(({ position, onClick, isHit, type, points }) => {
  const getTargetStyles = () => {
    switch (type) {
      case 'bonus':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse';
      case 'speed':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 animate-bounce';
      default:
        return 'bg-gradient-to-br from-purple-400 to-purple-600';
    }
  };

  return (
    <div
      className={cn(
        'target absolute w-12 h-12 md:w-10 md:h-10 rounded-full overflow-hidden shadow-lg',
        getTargetStyles(),
        isHit && 'target-hit'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {points}
      </div>
    </div>
  );
});

Target.displayName = 'Target';

export default Target;