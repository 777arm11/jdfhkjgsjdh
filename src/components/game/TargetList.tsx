import React from 'react';
import Target from '@/components/Target';
import { TargetType } from '@/types/game';

interface TargetListProps {
  targets: TargetType[];
  onTargetClick: (targetId: number) => void;
}

const TargetList: React.FC<TargetListProps> = React.memo(({ targets, onTargetClick }) => {
  return (
    <>
      {targets.map(target => (
        <Target
          key={target.id}
          position={target.position}
          isHit={target.isHit}
          onClick={() => onTargetClick(target.id)}
        />
      ))}
    </>
  );
});

TargetList.displayName = 'TargetList';

export default TargetList;