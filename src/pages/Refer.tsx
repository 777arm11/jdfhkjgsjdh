
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2, Copy, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerData } from "@/hooks/usePlayerData";

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalRewardsEarned: number;
}

const BOT_USERNAME = "Hope_Coin_tapbot";

const Refer = () => {
  const { toast } = useToast();
  const { playerData } = usePlayerData();
  const [walletAddress, setWalletAddress] = useState("");
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalRewardsEarned: 0
  });

  useEffect(() => {
    if (playerData?.id) {
      fetchReferralCode();
      fetchReferralStats();
    }
  }, [playerData?.id]);

  const fetchReferralCode = async () => {
    try {
      if (!playerData?.referral_code) {
        const { data, error } = await supabase
          .rpc('generate_referral_code');

        if (error) throw error;

        await supabase
          .from('players')
          .update({ referral_code: data })
          .eq('id', playerData.id);
      }
    } catch (err) {
      console.error('Error generating referral code:', err);
      toast({
        title: "Error",
        description: "Failed to generate referral code",
        variant: "destructive",
      });
    }
  };

  const fetchReferralStats = async () => {
    try {
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', playerData?.id);

      if (referralsError) throw referralsError;

      const stats: ReferralStats = {
        totalReferrals: referrals?.length || 0,
        pendingReferrals: referrals?.filter(r => r.status === 'pending').length || 0,
        completedReferrals: referrals?.filter(r => r.status === 'completed').length || 0,
        totalRewardsEarned: (referrals?.filter(r => r.status === 'completed').length || 0) * 1000
      };

      setReferralStats(stats);
    } catch (err) {
      console.error('Error fetching referral stats:', err);
    }
  };

  const handleCopyReferralLink = async () => {
    try {
      if (!playerData?.referral_code) {
        toast({
          title: "Error",
          description: "No referral code available",
          variant: "destructive",
        });
        return;
      }

      // Create Telegram-specific referral link
      const telegramReferralLink = `https://t.me/${BOT_USERNAME}?start=ref_${playerData.referral_code}`;
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

  const handleSaveWallet = async () => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ wallet_address: walletAddress })
        .eq('id', playerData?.id)
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Wallet address saved successfully",
      });
    } catch (err) {
      console.error('Error saving wallet:', err);
      toast({
        title: "Error",
        description: "Failed to save wallet address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-game-primary">
      <div className="py-8 px-4">
        <h1 className="text-2xl font-pixel text-white text-center mb-8">Refer Friends</h1>
        
        <div className="max-w-md mx-auto space-y-8">
          <div className="bg-game-secondary rounded-lg shadow-md p-6 border border-game-accent">
            <h2 className="text-xl font-pixel text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Referral Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-game-accent p-4 rounded-lg">
                <p className="text-sm font-pixel text-white/80">Total Referrals</p>
                <p className="text-2xl font-pixel text-white">{referralStats.totalReferrals}</p>
              </div>
              <div className="bg-game-accent p-4 rounded-lg">
                <p className="text-sm font-pixel text-white/80">Completed</p>
                <p className="text-2xl font-pixel text-white">{referralStats.completedReferrals}</p>
              </div>
              <div className="bg-game-accent p-4 rounded-lg">
                <p className="text-sm font-pixel text-white/80">Pending</p>
                <p className="text-2xl font-pixel text-white">{referralStats.pendingReferrals}</p>
              </div>
              <div className="bg-game-accent p-4 rounded-lg">
                <p className="text-sm font-pixel text-white/80">Rewards Earned</p>
                <p className="text-2xl font-pixel text-white">{referralStats.totalRewardsEarned}</p>
              </div>
            </div>
          </div>

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
                  value={playerData?.referral_code || ''}
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

          <div className="bg-game-secondary rounded-lg shadow-md p-6 border border-game-accent">
            <h2 className="text-xl font-pixel text-white mb-4">Your Tonekeeper Wallet</h2>
            <p className="text-white/80 font-pixel text-sm mb-6">
              Add your Tonekeeper wallet address to receive rewards.
            </p>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your Tonekeeper wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-game-accent border-game-accent text-white font-pixel placeholder:text-white/50"
              />
              
              <Button 
                onClick={handleSaveWallet}
                className="w-full bg-game-accent hover:bg-game-accent/80 text-white font-pixel"
              >
                Save Wallet Address
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;
