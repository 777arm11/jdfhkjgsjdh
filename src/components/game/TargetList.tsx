import React from "react";
import { TargetButton } from "@/components/Target";
import { useGameLogic } from "@/hooks/useGameLogic";

interface TargetListProps {
  targets: Array<{
    id: string;
    position: { x: number; y: number };
    isActive: boolean;
  }>;
  onTargetClick: (id: string) => void;
}

const TargetList: React.FC<TargetListProps> = ({ targets, onTargetClick }) => {
  const { isUpdating } = useGameLogic();

  return (
    <div className="relative w-full h-full">
      {targets.map((target) => (
        <TargetButton
          key={target.id}
          position={target.position}
          isActive={target.isActive}
          isUpdating={isUpdating}
          onClick={() => !isUpdating && onTargetClick(target.id)}
        />
      ))}
    </div>
  );
};

export default TargetList;