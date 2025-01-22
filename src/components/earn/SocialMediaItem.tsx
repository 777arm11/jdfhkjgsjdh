import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialMediaItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export const SocialMediaItem = ({ icon: Icon, label, onClick }: SocialMediaItemProps) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-game-primary hover:bg-game-accent border-2 border-game-text text-game-text"
    >
      <Icon className="h-5 w-5" />
      {label}
    </Button>
  );
};