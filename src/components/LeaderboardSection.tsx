import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalCoins } from "@/contexts/GlobalCoinsContext";

interface Player {
  id: string;
  username: string;
  coins: number;
  rank?: number;
}

export const LeaderboardSection = () => {
  const { toast } = useToast();
  const { totalCoins } = useGlobalCoins();

  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      console.log('Fetching leaderboard data...');
      const { data, error } = await supabase
        .from('players')
        .select('id, username, coins')
        .order('coins', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }

      return data.map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch leaderboard data",
      variant: "destructive",
    });
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-game-secondary border-game-accent">
      <CardHeader>
        <CardTitle className="text-2xl font-pixel text-center text-white">Top 100 Players</CardTitle>
        <div className="text-center text-sm font-pixel text-white/80">
          Global Coin Pool: {totalCoins.toLocaleString()} coins
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-game-accent">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-game-accent">
                <TableHead className="w-24 text-white/80 font-pixel">Rank</TableHead>
                <TableHead className="text-white/80 font-pixel">Player</TableHead>
                <TableHead className="text-right text-white/80 font-pixel">Coins</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-white font-pixel">Loading...</TableCell>
                </TableRow>
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-white font-pixel">No players found</TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow key={player.id} className="border-b border-game-accent hover:bg-game-accent/20">
                    <TableCell className="font-pixel text-white">{player.rank}</TableCell>
                    <TableCell className="font-pixel text-white">{player.username || 'Anonymous'}</TableCell>
                    <TableCell className="text-right font-pixel text-white">
                      {player.coins?.toLocaleString() || '0'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};