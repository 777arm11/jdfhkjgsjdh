
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ParticleEffect from './game/ParticleEffect';

interface TargetProps {
  position: { x: number; y: number };
  onClick: () => void;
  isHit: boolean;
  size?: 'large' | 'small';
}

const Target: React.FC<TargetProps> = React.memo(({ position, onClick, isHit, size = 'small' }) => {
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShowParticles(true);
    onClick();
    setTimeout(() => setShowParticles(false), 500);
  };

  return (
    <>
      <div
        className={cn(
          'target absolute rounded-full overflow-hidden shadow-lg transition-all duration-700 ease-in-out transform -translate-x-1/2 -translate-y-1/2 cursor-pointer',
          size === 'large' ? 'w-32 h-32 md:w-40 md:h-40' : 'w-12 h-12 md:w-16 md:h-16',
          isHit && 'target-hit scale-0 opacity-0',
          'hover:scale-110 active:scale-95'
        )}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          backgroundImage: 'url(/lovable-uploads/7db07855-ed96-42bd-a8c5-182360b878c6.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        onClick={handleClick}
      />
      {showParticles && (
        <ParticleEffect 
          x={position.x} 
          y={position.y}
        />
      )}
    </>
  );
});

Target.displayName = 'Target';

export default Target;
