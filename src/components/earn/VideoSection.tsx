import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

  const handleWatchVideo = (video: typeof videos[0]) => {
    setCurrentVideo(video);
    window.open(video.url, '_blank');
    setIsVerificationOpen(true);
  };

  const handleVerifyCode = () => {
    if (currentVideo && verificationCode === currentVideo.verificationCode) {
      toast({
        title: "Success!",
        description: "You've earned 100 coins for watching the video!",
      });
      setIsVerificationOpen(false);
      setVerificationCode("");
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct verification code shown in the video.",
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
          <Button 
            key={video.number}
            onClick={() => handleWatchVideo(video)}
            className="w-full flex items-center justify-center gap-2 bg-game-primary hover:bg-game-accent border-2 border-game-text text-game-text"
          >
            <Youtube className="h-5 w-5" />
            Watch Video {video.number}
          </Button>
        ))}
      </div>

      <AlertDialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <AlertDialogContent className="bg-game-secondary border-2 border-game-text">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-game-text">Enter Verification Code</AlertDialogTitle>
            <AlertDialogDescription className="text-game-text/80">
              Please enter the verification code shown in the video to receive your coins.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              type="text"
              placeholder="Enter code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-game-primary text-game-text border-game-text"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-game-accent text-game-text border-game-text hover:bg-game-primary">
              Cancel
            </AlertDialogCancel>
            <Button 
              onClick={handleVerifyCode}
              className="bg-game-primary text-game-text border-2 border-game-text hover:bg-game-accent"
            >
              Verify Code
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};