
export interface TargetType {
  id: string;
  position: {
    x: number;
    y: number;
  };
  isHit: boolean;
  isMain?: boolean;
}

export interface PlayerStats {
  score: number;
  highScore: number;
  coins: number;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  highScore: number;
  coins: number;
}
