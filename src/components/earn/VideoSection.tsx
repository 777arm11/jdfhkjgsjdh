import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useGlobalCoins } from "@/contexts/GlobalCoinsContext";
import { VideoItem } from "./VideoItem";
import { VerificationDialog } from "./VerificationDialog";
import { handleCoinIncrement } from "@/utils/coinUtils";

const videos = [
  { 
    number: 1, 
    url: "https://www.youtube.com/watch?v=your-video-1-id",
    verificationCode: "CODE1"
  },
  { 
    number: 2, 
    url: "https://www.youtube.com/watch?v=your-video-2-id",
    verificationCode: "CODE2"
  },
  { 
    number: 3, 
    url: "https://www.youtube.com/watch?v=your-video-3-id",
    verificationCode: "CODE3"
  },
];

export const VideoSection = () => {
  const { toast } = useToast();
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [currentVideo, setCurrentVideo] = useState<typeof videos[0] | null>(null);
  const { totalCoins } = useGlobalCoins();

  const handleWatchVideo = (video: typeof videos[0]) => {
    setCurrentVideo(video);
    window.open(video.url, '_blank');
    setIsVerificationOpen(true);
  };

  const handleVerifyCode = async () => {
    if (!currentVideo || verificationCode !== currentVideo.verificationCode) {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct verification code shown in the video.",
        variant: "destructive",
      });
      return;
    }

    if (totalCoins < 100) {
      toast({
        title: "Global Pool Depleted",
        description: "The global coin pool has been depleted!",
        variant: "destructive",
      });
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const telegramId = urlParams.get('id');
      
      await handleCoinIncrement(telegramId, 100);

      toast({
        title: "Success!",
        description: "You've earned 100 coins for watching the video!",
      });
      
      setIsVerificationOpen(false);
      setVerificationCode("");
    } catch (error) {
      console.error('Error updating coins:', error);
      toast({
        title: "Error",
        description: "Failed to update coins. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-game-secondary rounded-lg border-2 border-game-text p-6">
      <h2 className="text-xl font-semibold mb-4">Watch Videos</h2>
      <p className="text-game-text/80 mb-4">
        Watch videos and enter the verification code shown to earn 100 coins per video.
      </p>
      <div className="grid gap-3">
        {videos.map((video) => (
          <VideoItem 
            key={video.number}
            number={video.number}
            onWatch={() => handleWatchVideo(video)}
          />
        ))}
      </div>

      <VerificationDialog
        isOpen={isVerificationOpen}
        onOpenChange={setIsVerificationOpen}
        verificationCode={verificationCode}
        onVerificationCodeChange={setVerificationCode}
        onVerify={handleVerifyCode}
      />
    </div>
  );
};