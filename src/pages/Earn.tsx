import { Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Earn = () => {
  const { toast } = useToast();
  const [videoLink, setVideoLink] = useState("");
  const [videoCode, setVideoCode] = useState("");
  // This would typically come from your auth context or environment
  const isDeveloper = process.env.NODE_ENV === 'development';

  const handleWatchVideo = (videoNumber: number) => {
    // This is a placeholder - in a real implementation, you would integrate
    // with a video platform API
    toast({
      title: "Video Reward",
      description: `You've earned 100 coins for watching video ${videoNumber}!`,
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

  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoLink || !videoCode) {
      toast({
        title: "Error",
        description: "Please provide both video link and code",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Video details submitted successfully!",
    });
    setVideoLink("");
    setVideoCode("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Earn Coins</h1>
      
      <Tabs defaultValue="social" className="max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="social" className="mt-6">
          <div className="grid gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Watch Videos</h2>
              <p className="text-gray-600 mb-4">
                Watch videos to earn coins. Each video completion rewards you with 100 coins.
              </p>
              <div className="grid gap-3">
                {[1, 2, 3].map((num) => (
                  <Button 
                    key={num}
                    onClick={() => handleWatchVideo(num)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Youtube className="h-5 w-5" />
                    Watch Video {num}
                  </Button>
                ))}
              </div>

              {isDeveloper && (
                <form onSubmit={handleSubmitVideo} className="mt-6 space-y-4 border-t pt-6">
                  <div className="bg-yellow-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-yellow-800">Developer Section</p>
                  </div>
                  <div>
                    <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Video Link
                    </label>
                    <Input
                      id="videoLink"
                      type="url"
                      placeholder="Enter video link"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="videoCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Video Code
                    </label>
                    <Input
                      id="videoCode"
                      type="text"
                      placeholder="Enter video code"
                      value={videoCode}
                      onChange={(e) => setVideoCode(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Video Details
                  </Button>
                </form>
              )}
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
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              New earning opportunities will be available here soon. Stay tuned!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Earn;