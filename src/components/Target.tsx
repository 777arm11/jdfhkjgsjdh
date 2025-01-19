import React from 'react';
import { cn } from '@/lib/utils';

interface TargetProps {
  position: { x: number; y: number };
  onClick: () => void;
  isHit: boolean;
  size?: 'large' | 'small';
}

const Target: React.FC<TargetProps> = React.memo(({ position, onClick, isHit, size = 'small' }) => {
  return (
    <div
      className={cn(
        'target absolute rounded-full overflow-hidden shadow-lg transition-all duration-300',
        size === 'large' ? 'w-32 h-32' : 'w-8 h-8 md:w-6 md:h-6',
        isHit && 'target-hit scale-0 opacity-0'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        backgroundImage: 'url(/lovable-uploads/7db07855-ed96-42bd-a8c5-182360b878c6.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onClick={onClick}
    />
  );
});

Target.displayName = 'Target';

export default Target;