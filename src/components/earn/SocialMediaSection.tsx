import { Youtube, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Social media URLs - Replace these with your actual channel URLs
const socialMediaLinks = {
  youtube: "https://youtube.com/@your-channel",
  twitter: "https://twitter.com/your-profile",
  hopeChannel: "https://t.me/hope_2_coin",
  chaosTeam: "https://t.me/chaos-team-channel"
};

export const SocialMediaSection = () => {
  const { toast } = useToast();

  const handleSocialMediaEngage = (platform: string) => {
    // Open the corresponding URL in a new tab
    const url = socialMediaLinks[platform as keyof typeof socialMediaLinks];
    window.open(url, '_blank');
    
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
          onClick={() => handleSocialMediaEngage("youtube")}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Youtube className="h-5 w-5" />
          Subscribe on YouTube
        </Button>
        <Button 
          onClick={() => handleSocialMediaEngage("twitter")}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Twitter className="h-5 w-5" />
          Follow on Twitter
        </Button>
        <Button 
          onClick={() => handleSocialMediaEngage("hopeChannel")}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Join Hope Coin Channel
        </Button>
        <Button 
          onClick={() => handleSocialMediaEngage("chaosTeam")}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Join Chaos Team Channel
        </Button>
      </div>
    </div>
  );
};
