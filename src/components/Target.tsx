import React from 'react';
import { cn } from '@/lib/utils';

interface TargetProps {
  position: { x: number; y: number };
  onClick: () => void;
  isHit: boolean;
}

const Target: React.FC<TargetProps> = ({ position, onClick, isHit }) => {
  return (
    <div
      className={cn(
        'target absolute w-12 h-12 rounded-full bg-primary',
        isHit && 'target-hit'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
    />
  );
};

export default Target;