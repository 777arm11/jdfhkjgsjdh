export interface TargetType {
  id: number;
  position: {
    x: number;
    y: number;
  };
  isHit: boolean;
  points: number;
  type: 'normal' | 'bonus' | 'speed';
}

export interface ComboState {
  count: number;
  multiplier: number;
  lastHitTime: number;
}