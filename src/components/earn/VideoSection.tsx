import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Video URLs - in a real app, these would come from your backend
const videos = [
  { number: 1, url: "https://www.youtube.com/watch?v=video1" },
  { number: 2, url: "https://www.youtube.com/watch?v=video2" },
  { number: 3, url: "https://www.youtube.com/watch?v=video3" },
];

export const VideoSection = () => {
  const { toast } = useToast();

  const handleWatchVideo = (videoNumber: number, url: string) => {
    // Open video URL in a new tab
    window.open(url, '_blank');
    
    // Show toast notification
    toast({
      title: "Video Opening",
      description: `Opening video ${videoNumber} in a new tab`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Watch Videos</h2>
      <p className="text-gray-600 mb-4">
        Watch videos to earn coins. Each video completion rewards you with 100 coins.
      </p>
      <div className="grid gap-3">
        {videos.map((video) => (
          <Button 
            key={video.number}
            onClick={() => handleWatchVideo(video.number, video.url)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Youtube className="h-5 w-5" />
            Watch Video {video.number}
          </Button>
        ))}
      </div>
    </div>
  );
};