
import { useEffect, useState } from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GiftIcon, TimerIcon } from 'lucide-react';

export const DailyRewardsSection = () => {
  const { playerData } = usePlayerData();
  const { toast } = useToast();
  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDailyRewardStatus = async () => {
      if (!playerData?.id) return;

      const { data, error } = await supabase
        .from('daily_login_rewards')
        .select('current_streak, last_claim_date')
        .eq('player_id', playerData.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily reward status:', error);
        return;
      }

      if (data) {
        setStreak(data.current_streak);
        const lastClaim = new Date(data.last_claim_date);
        const now = new Date();
        const canClaimToday = lastClaim.getDate() !== now.getDate() || 
                             lastClaim.getMonth() !== now.getMonth() ||
                             lastClaim.getFullYear() !== now.getFullYear();
        setCanClaim(canClaimToday);
      } else {
        // No previous claims, user can claim
        setStreak(0);
        setCanClaim(true);
      }
    };

    fetchDailyRewardStatus();
  }, [playerData?.id]);

  useEffect(() => {
    const updateTimeUntilReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async () => {
    if (!playerData?.id || !canClaim || isLoading) return;

    setIsLoading(true);
    try {
      const { data: result, error } = await supabase
        .rpc('claim_daily_reward', {
          p_player_id: playerData.id
        });

      if (error) throw error;

      if (result > 0) {
        toast({
          title: "Daily Reward Claimed!",
          description: `You earned ${result} coins. Current streak: ${streak + 1}/50`,
        });
        setStreak(prev => prev + 1);
        setCanClaim(false);
      } else {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily reward today.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-game-secondary rounded-lg border-2 border-game-text p-6">
      <h2 className="text-xl font-semibold mb-4">Daily Login Rewards</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span>Streak Progress</span>
          <span className="text-sm">{streak}/50 days</span>
        </div>
        
        <Progress value={(streak / 50) * 100} className="h-2" />
        
        <div className="flex items-center gap-2 text-sm text-game-text/80">
          <TimerIcon className="h-4 w-4" />
          <span>Next reset in: {timeUntilReset}</span>
        </div>

        <div className="mt-4">
          <Button
            onClick={handleClaim}
            disabled={!canClaim || isLoading}
            className="w-full bg-game-accent hover:bg-game-accent/90 text-white font-pixel"
          >
            <GiftIcon className="mr-2 h-4 w-4" />
            {canClaim ? "Claim 50 Coins" : "Already Claimed"}
          </Button>
        </div>

        <p className="text-sm text-game-text/80 mt-2">
          Come back daily to maintain your streak and earn rewards!
        </p>
      </div>
    </div>
  );
};
