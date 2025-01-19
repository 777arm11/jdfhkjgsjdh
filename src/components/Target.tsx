import React from 'react';
import { cn } from '@/lib/utils';

interface TargetProps {
  position: { x: number; y: number };
  onClick: () => void;
  isHit: boolean;
}

const Target: React.FC<TargetProps> = React.memo(({ position, onClick, isHit }) => {
  return (
    <div
      className={cn(
        'target absolute w-12 h-12 rounded-full overflow-hidden',
        isHit && 'target-hit'
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