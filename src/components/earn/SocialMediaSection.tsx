
import { Youtube, Twitter, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGlobalCoins } from "@/contexts/GlobalCoinsContext";
import { SocialMediaItem } from "./SocialMediaItem";
import { handleCoinIncrement } from "@/utils/coinUtils";

const socialMediaLinks = {
  youtube: "https://www.youtube.com/channel/UCHb5HtX4iGaRxEG0sweHyyg",
  twitter: "https://x.com/H0peCoin",
  hopeChannel: "https://t.me/hope_2_coin",
  chaosTeam: "https://t.me/chaos-team-channel"
};

const socialMediaItems = [
  { platform: "youtube", icon: Youtube, label: "Subscribe on YouTube" },
  { platform: "twitter", icon: Twitter, label: "Follow on Twitter" },
  { platform: "hopeChannel", icon: MessageCircle, label: "Join Hope Coin Channel" },
  { platform: "chaosTeam", icon: MessageCircle, label: "Join Chaos Team Channel" },
];

export const SocialMediaSection = () => {
  const { toast } = useToast();
  const { totalCoins } = useGlobalCoins();

  const handleSocialMediaEngage = async (platform: string) => {
    if (totalCoins < 50) {
      toast({
        title: "Global Pool Depleted",
        description: "The global coin pool has been depleted!",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleCoinIncrement(50);
      
      const url = socialMediaLinks[platform as keyof typeof socialMediaLinks];
      window.open(url, '_blank');
      
      toast({
        title: "Social Media Engagement",
        description: `You've earned 50 coins for engaging on ${platform}!`,
      });
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
      <h2 className="text-xl font-semibold mb-4">Social Media Engagement</h2>
      <p className="text-game-text/80 mb-4">
        Engage with our social media accounts to earn coins. Each engagement rewards you with 50 coins.
      </p>
      <div className="grid gap-3">
        {socialMediaItems.map((item) => (
          <SocialMediaItem
            key={item.platform}
            icon={item.icon}
            label={item.label}
            onClick={() => handleSocialMediaEngage(item.platform)}
          />
        ))}
      </div>
    </div>
  );
};
