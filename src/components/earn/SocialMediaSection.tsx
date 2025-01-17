import { Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const SocialMediaSection = () => {
  const { toast } = useToast();

  const handleSocialMediaEngage = (platform: string) => {
    toast({
      title: "Social Media Engagement",
      description: `You've earned 50 coins for engaging on ${platform}!`,
    });
  };

  return (
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
  );
};