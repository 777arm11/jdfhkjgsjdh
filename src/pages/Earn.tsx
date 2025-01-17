import { Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Earn = () => {
  const { toast } = useToast();

  const handleWatchVideo = () => {
    // This is a placeholder - in a real implementation, you would integrate
    // with a video platform API
    toast({
      title: "Video Reward",
      description: "You've earned 100 coins for watching the video!",
    });
  };

  const handleSocialMediaEngage = (platform: string) => {
    // This is a placeholder - in a real implementation, you would verify
    // the social media engagement
    toast({
      title: "Social Media Engagement",
      description: `You've earned 50 coins for engaging on ${platform}!`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Earn Coins</h1>
      
      <div className="grid gap-6 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Watch Videos</h2>
          <p className="text-gray-600 mb-4">
            Watch videos to earn coins. Each video completion rewards you with 100 coins.
          </p>
          <Button 
            onClick={handleWatchVideo}
            className="w-full flex items-center justify-center gap-2"
          >
            <Youtube className="h-5 w-5" />
            Watch Video
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Social Media Engagement</h2>
          <p className="text-gray-600 mb-4">
            Engage with our social media accounts to earn coins. Each engagement rewards you with 50 coins.
          </p>
          <div className="grid gap-3">
            <Button 
              onClick={() => handleSocialMediaEngage("YouTube")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Youtube className="h-5 w-5" />
              Subscribe on YouTube
            </Button>
            <Button 
              onClick={() => handleSocialMediaEngage("Twitter")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Twitter className="h-5 w-5" />
              Follow on Twitter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;