import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  username: string;
  coins: number;
  rank?: number;
}

// Temporary mock data - Replace with actual API call
const mockPlayers: Player[] = Array.from({ length: 100 }, (_, i) => ({
  id: `player-${i + 1}`,
  username: `Player ${i + 1}`,
  coins: Math.floor(Math.random() * 5000000000), // Random coins up to 5B
}));

export const LeaderboardSection = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { toast } = useToast();

  const fetchLeaderboardData = async () => {
    try {
      // TODO: Replace with actual API call
      const sortedPlayers = [...mockPlayers].sort((a, b) => b.coins - a.coins);
      const rankedPlayers = sortedPlayers.map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
      setPlayers(rankedPlayers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leaderboard data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchLeaderboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Top 100 Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Coins</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.rank}</TableCell>
                  <TableCell>{player.username}</TableCell>
                  <TableCell className="text-right">
                    {player.coins.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};