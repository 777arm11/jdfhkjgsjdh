import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoItemProps {
  number: number;
  onWatch: () => void;
}

export const VideoItem = ({ number, onWatch }: VideoItemProps) => {
  return (
    <Button 
      onClick={onWatch}
      className="w-full flex items-center justify-center gap-2 bg-game-primary hover:bg-game-accent border-2 border-game-text text-game-text"
    >
      <Youtube className="h-5 w-5" />
      Watch Video {number}
    </Button>
  );
};