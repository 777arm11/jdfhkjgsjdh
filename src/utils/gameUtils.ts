
import { v4 as uuidv4 } from 'uuid';
import { TargetType } from '@/types/game';

export const generateTargetId = () => uuidv4();

export const getRandomPosition = () => ({
  x: Math.random() * 80 + 10,
  y: Math.random() * 60 + 20,
});

export type GameState = {
  targets: TargetType[];
  mainTargetHit: boolean;
  combo: number;
  lastHitTime: number;
};

export type GameAction = 
  | { type: 'SPAWN_MAIN_TARGET' }
  | { type: 'SPAWN_SMALL_TARGETS' }
  | { type: 'HIT_TARGET'; targetId: string }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_COMBO'; timestamp: number };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SPAWN_MAIN_TARGET':
      return {
        ...state,
        targets: [{
          id: generateTargetId(),
          position: getRandomPosition(),
          isHit: false,
          isMain: true
        }],
        mainTargetHit: false,
        combo: 1
      };

    case 'SPAWN_SMALL_TARGETS':
      const smallTargets = Array.from({ length: 5 }, () => ({
        id: generateTargetId(),
        position: getRandomPosition(),
        isHit: false,
        isMain: false
      }));
      return {
        ...state,
        targets: [...state.targets.map(t => 
          t.isMain ? { ...t, isHit: true } : t
        ), ...smallTargets],
        mainTargetHit: true
      };

    case 'HIT_TARGET':
      return {
        ...state,
        targets: state.targets.map(t =>
          t.id === action.targetId ? { ...t, isHit: true } : t
        )
      };

    case 'UPDATE_COMBO':
      const timeDiff = action.timestamp - state.lastHitTime;
      return {
        ...state,
        combo: timeDiff < 1000 ? Math.min(state.combo + 1, 5) : 1,
        lastHitTime: action.timestamp
      };

    case 'RESET_GAME':
      return {
        targets: [],
        mainTargetHit: false,
        combo: 1,
        lastHitTime: 0
      };

    default:
      return state;
  }
};
