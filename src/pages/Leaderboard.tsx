
import React from "react";
import { LeaderboardSection } from "@/components/LeaderboardSection";

const Leaderboard = () => {
  return (
    <div className="w-full min-h-screen bg-game-primary">
      <div className="py-8">
        <LeaderboardSection />
      </div>
    </div>
  );
};

export default Leaderboard;
