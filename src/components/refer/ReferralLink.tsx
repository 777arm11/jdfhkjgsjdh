
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2, Copy } from "lucide-react";

interface ReferralLinkProps {
  referralCode: string;
}

const BOT_USERNAME = "Hope_Coin_tapbot";

export const ReferralLink = ({ referralCode }: ReferralLinkProps) => {
  const { toast } = useToast();

  const handleCopyReferralLink = async () => {
    try {
      if (!referralCode) {
        toast({
          title: "Error",
          description: "No referral code available",
          variant: "destructive",
        });
        return;
      }

      const telegramReferralLink = `https://t.me/${BOT_USERNAME}?start=ref_${referralCode}`;
      await navigator.clipboard.writeText(telegramReferralLink);
      
      toast({
        title: "Success!",
        description: "Telegram referral link copied to clipboard!",
      });
    } catch (err) {
      console.error('Error handling referral:', err);
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-game-secondary rounded-lg shadow-md p-6 border border-game-accent">
      <h2 className="text-xl font-pixel text-white mb-4">Share Your Referral Link</h2>
      <p className="text-white/80 font-pixel text-sm mb-6">
        Invite your friends to join through Telegram and earn rewards! You'll receive 1000 coins for each friend who joins using your referral link.
      </p>
      
      <div className="bg-game-accent p-4 rounded-lg mb-6">
        <p className="text-sm font-pixel text-white">Your Referral Code</p>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="text"
            value={referralCode}
            readOnly
            className="bg-game-accent border-game-accent text-white font-pixel"
          />
          <Button
            onClick={handleCopyReferralLink}
            className="bg-game-primary hover:bg-game-primary/80"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={handleCopyReferralLink}
        className="w-full flex items-center justify-center gap-2 bg-game-accent hover:bg-game-accent/80 text-white font-pixel"
      >
        <Link2 className="h-5 w-5" />
        Copy Telegram Referral Link
      </Button>
    </div>
  );
};
