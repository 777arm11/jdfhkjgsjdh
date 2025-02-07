
export interface TargetType {
  id: number;
  position: {
    x: number;
    y: number;
  };
  isHit: boolean;
  isMain?: boolean;
}
