
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ x, y }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }).map((_, index) => ({
      id: Date.now() + index,
      x,
      y,
      size: Math.random() * 4 + 2,
      opacity: 1,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [x, y]);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-purple-400 animate-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </>
  );
};

export default ParticleEffect;
