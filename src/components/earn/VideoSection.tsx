import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Video URLs - Replace these URLs with your actual video links
const videos = [
  { number: 1, url: "https://www.youtube.com/watch?v=your-video-1-id" },
  { number: 2, url: "https://www.youtube.com/watch?v=your-video-2-id" },
  { number: 3, url: "https://www.youtube.com/watch?v=your-video-3-id" },
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