
import { Users } from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalRewardsEarned: number;
}

interface ReferralStatsProps {
  stats: ReferralStats;
}

export const ReferralStats = ({ stats }: ReferralStatsProps) => {
  return (
    <div className="bg-game-secondary rounded-lg shadow-md p-6 border border-game-accent">
      <h2 className="text-xl font-pixel text-white mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Your Referral Stats
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-game-accent p-4 rounded-lg">
          <p className="text-sm font-pixel text-white/80">Total Referrals</p>
          <p className="text-2xl font-pixel text-white">{stats.totalReferrals}</p>
        </div>
        <div className="bg-game-accent p-4 rounded-lg">
          <p className="text-sm font-pixel text-white/80">Completed</p>
          <p className="text-2xl font-pixel text-white">{stats.completedReferrals}</p>
        </div>
        <div className="bg-game-accent p-4 rounded-lg">
          <p className="text-sm font-pixel text-white/80">Pending</p>
          <p className="text-2xl font-pixel text-white">{stats.pendingReferrals}</p>
        </div>
        <div className="bg-game-accent p-4 rounded-lg">
          <p className="text-sm font-pixel text-white/80">Rewards Earned</p>
          <p className="text-2xl font-pixel text-white">{stats.totalRewardsEarned}</p>
        </div>
      </div>
    </div>
  );
};
