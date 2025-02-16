
export interface TargetType {
  id: string;
  position: {
    x: number;
    y: number;
  };
  isHit: boolean;
  isMain?: boolean;
}
