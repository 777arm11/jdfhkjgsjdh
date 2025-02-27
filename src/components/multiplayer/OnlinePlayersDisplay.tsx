
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OnlinePlayer } from '@/hooks/usePlayerPresence';

interface OnlinePlayersDisplayProps {
  players: OnlinePlayer[];
}

const OnlinePlayersDisplay: React.FC<OnlinePlayersDisplayProps> = ({ players }) => {
  const [showPlayers, setShowPlayers] = useState(false);

  // Get avatar fallback from username
  const getAvatarFallback = (username: string | null) => {
    if (!username) return 'A';
    return username.substring(0, 2).toUpperCase();
  };

  // Format last active time
  const getLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  if (!players.length) return null;

  return (
    <div className="relative">
      <Button 
        size="sm" 
        variant="secondary" 
        className="flex items-center gap-2 bg-game-secondary text-game-text border border-game-accent"
        onClick={() => setShowPlayers(!showPlayers)}
      >
        <Users size={18} />
        <span className="font-pixel">Players: {players.length}</span>
      </Button>
      
      {showPlayers && (
        <Card className="absolute top-full right-0 mt-2 w-64 bg-game-secondary border border-game-accent z-20">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-pixel flex items-center justify-between">
              <span>Online Players</span>
              <Badge variant="outline" className="font-pixel">{players.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-0">
            <ScrollArea className="h-48 px-4">
              <div className="space-y-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-game-accent/20">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 bg-game-accent">
                        <AvatarFallback className="text-xs">{getAvatarFallback(player.username)}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs font-pixel truncate">{player.username}</div>
                    </div>
                    <div className="text-xs text-white/60 font-pixel">{getLastActive(player.lastActive)}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnlinePlayersDisplay;
