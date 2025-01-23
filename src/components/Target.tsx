import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

interface TargetProps {
  position: { x: number; y: number };
  onClick: () => void;
  isActive?: boolean;
  isUpdating?: boolean;
}

export const Target: React.FC<TargetProps> = ({
  position,
  onClick,
  isActive = true,
  isUpdating = false,
}) => {
  return (
    <Button
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-0",
        isUpdating ? "animate-pulse cursor-not-allowed" : "hover:scale-110",
        "bg-game-accent hover:bg-game-accent/80 text-white"
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onClick={onClick}
      disabled={!isActive || isUpdating}
    >
      <Target className={cn(
        "w-6 h-6",
        isUpdating && "animate-spin"
      )} />
    </Button>
  );
};