
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerData } from "@/hooks/usePlayerData";
import { useToast } from "@/hooks/use-toast";
import { ReferralStats } from "@/components/refer/ReferralStats";
import { ReferralLink } from "@/components/refer/ReferralLink";
import { WalletSection } from "@/components/refer/WalletSection";

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalRewardsEarned: number;
}

const Refer = () => {
  const { toast } = useToast();
  const { playerData } = usePlayerData();
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
        totalRewardsEarned: referrals?.reduce((total, ref) => {
          // If reward_amount is set, use it, otherwise use 50 for new referrals
          return total + (ref.status === 'completed' ? (ref.reward_amount || 50) : 0);
        }, 0) || 0
      };

      setReferralStats(stats);
    } catch (err) {
      console.error('Error fetching referral stats:', err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-game-primary">
      <div className="py-8 px-4">
        <h1 className="text-2xl font-pixel text-white text-center mb-8">Refer Friends</h1>
        
        <div className="max-w-md mx-auto space-y-8">
          <ReferralStats stats={referralStats} />
          <ReferralLink referralCode={playerData?.referral_code || ''} />
          {playerData?.id && <WalletSection playerId={playerData.id} />}
        </div>
      </div>
    </div>
  );
};

export default Refer;
