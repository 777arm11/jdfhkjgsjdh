import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  username: string;
  coins: number;
  rank?: number;
}

export const LeaderboardSection = () => {
  const { toast } = useToast();

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

      // Add rank to each player
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No players found</TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.rank}</TableCell>
                    <TableCell>{player.username || 'Anonymous'}</TableCell>
                    <TableCell className="text-right">
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