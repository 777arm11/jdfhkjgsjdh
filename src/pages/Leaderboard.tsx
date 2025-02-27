
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Medal, Trophy, Users, RefreshCw } from "lucide-react";
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { usePlayerData } from '@/hooks/usePlayerData';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardPlayer {
  id: string;
  username: string | null;
  coins: number;
  rank?: number;
}

const Leaderboard = () => {
  const [globalPlayers, setGlobalPlayers] = useState<LeaderboardPlayer[]>([]);
  const [friendsPlayers, setFriendsPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colorScheme, hapticFeedback, webApp } = useTelegramWebApp();
  const { playerData } = usePlayerData();

  // Function to add rank to players
  const addRankToPlayers = (players: LeaderboardPlayer[]): LeaderboardPlayer[] => {
    return players.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  };

  // Load leaderboard data
  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch global top players
      const { data: globalData, error: globalError } = await supabase
        .from('players')
        .select('id, username, coins')
        .order('coins', { ascending: false })
        .limit(100);
      
      if (globalError) throw globalError;
      
      setGlobalPlayers(addRankToPlayers(globalData || []));
      
      // Fetch friends (placeholder for now)
      // In a real implementation, you would fetch friends data based on friend connections
      const { data: friendsData, error: friendsError } = await supabase
        .from('players')
        .select('id, username, coins')
        .order('coins', { ascending: false })
        .limit(20);
      
      if (friendsError) throw friendsError;
      
      setFriendsPlayers(addRankToPlayers(friendsData || []));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and setup real-time subscription
  useEffect(() => {
    loadLeaderboardData();
    
    // Set up real-time subscription for leaderboard updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'players',
          filter: 'coins=gt.0'
        },
        (payload) => {
          console.log('Player data changed:', payload);
          // Refresh leaderboard data when a player's score changes
          loadLeaderboardData();
        }
      )
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get player rank color
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-white';
  };

  // Get medal for top ranks
  const getRankMedal = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  // Get avatar fallback
  const getAvatarFallback = (username: string | null) => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  };

  // Check if player is current user
  const isCurrentPlayer = (id: string) => {
    return playerData?.id === id;
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshing(true);
    hapticFeedback('medium');
    loadLeaderboardData();
    
    // Show animation in Telegram WebApp
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('medium');
    }
  };

  // Show loader while fetching data
  if (isLoading && !refreshing) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-game-primary ${colorScheme === 'dark' ? 'dark' : ''}`}>
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-game-primary p-4 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-pixel text-white">Leaderboard</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="font-pixel bg-game-secondary border-game-accent text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <Tabs defaultValue="global">
          <TabsList className="grid grid-cols-2 mb-6 bg-game-secondary">
            <TabsTrigger value="global" className="font-pixel">
              <Trophy className="h-4 w-4 mr-2" /> Global
            </TabsTrigger>
            <TabsTrigger value="friends" className="font-pixel">
              <Users className="h-4 w-4 mr-2" /> Friends
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="global">
            <Card className="bg-game-secondary border-game-accent">
              <CardHeader className="pb-3">
                <CardTitle className="font-pixel">Top Players</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-game-accent">
                      <TableHead className="font-pixel text-white">Rank</TableHead>
                      <TableHead className="font-pixel text-white">Player</TableHead>
                      <TableHead className="font-pixel text-white text-right">Coins</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {globalPlayers.map((player) => (
                      <TableRow 
                        key={player.id}
                        className={`border-b border-game-accent/30 ${isCurrentPlayer(player.id) ? 'bg-game-accent/20' : ''}`}
                      >
                        <TableCell className="font-pixel">
                          <div className="flex items-center gap-2">
                            <span className={getRankColor(player.rank || 0)}>
                              {player.rank}
                            </span>
                            {getRankMedal(player.rank || 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-game-accent">
                              <AvatarFallback>{getAvatarFallback(player.username)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-pixel">{player.username || 'Anonymous'}</span>
                              {isCurrentPlayer(player.id) && (
                                <Badge variant="outline" className="text-xs font-pixel bg-game-accent/30 text-white border-game-accent">
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-pixel text-yellow-400">
                          {player.coins.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {globalPlayers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-sm text-white/60 py-8">
                          No players found. Be the first to join the leaderboard!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="friends">
            <Card className="bg-game-secondary border-game-accent">
              <CardHeader className="pb-3">
                <CardTitle className="font-pixel flex items-center justify-between">
                  <span>Friends Ranking</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs font-pixel bg-game-primary"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Invite Friends
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-game-accent">
                      <TableHead className="font-pixel text-white">Rank</TableHead>
                      <TableHead className="font-pixel text-white">Friend</TableHead>
                      <TableHead className="font-pixel text-white text-right">Coins</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {friendsPlayers.map((player) => (
                      <TableRow 
                        key={player.id}
                        className={`border-b border-game-accent/30 ${isCurrentPlayer(player.id) ? 'bg-game-accent/20' : ''}`}
                      >
                        <TableCell className="font-pixel">
                          <div className="flex items-center gap-2">
                            <span className={getRankColor(player.rank || 0)}>
                              {player.rank}
                            </span>
                            {getRankMedal(player.rank || 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-game-accent">
                              <AvatarFallback>{getAvatarFallback(player.username)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-pixel">{player.username || 'Anonymous'}</span>
                              {isCurrentPlayer(player.id) && (
                                <Badge variant="outline" className="text-xs font-pixel bg-game-accent/30 text-white border-game-accent">
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-pixel text-yellow-400">
                          {player.coins.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {friendsPlayers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-sm text-white/60 py-8">
                          No friends found. Invite friends to compare scores!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
