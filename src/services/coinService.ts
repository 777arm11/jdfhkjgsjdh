
import { supabase } from '@/integrations/supabase/client';
import { getBrowserId } from '@/utils/browserUtils';
import { Database } from '@/integrations/supabase/types';

type Player = Database['public']['Tables']['players']['Row'];

interface QueuedOperation {
  playerId: string;
  amount: number;
  retryCount: number;
}

class CoinService {
  private static instance: CoinService;
  private operationQueue: QueuedOperation[] = [];
  private isProcessing: boolean = false;
  private maxRetries: number = 3;
  private retryDelay: number = 200;
  private batchSize: number = 5;
  private subscribers: Set<(coins: number) => void> = new Set();

  private constructor() {
    this.setupRealtimeSubscription();
    this.processQueue();
    window.addEventListener('online', () => this.processQueue());
  }

  static getInstance(): CoinService {
    if (!CoinService.instance) {
      CoinService.instance = new CoinService();
    }
    return CoinService.instance;
  }

  private setupRealtimeSubscription() {
    const browserId = getBrowserId();
    const channel = supabase
      .channel('public:players')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `browser_id=eq.${browserId}`
        },
        (payload) => {
          const newRecord = payload.new as Player;
          if (newRecord && typeof newRecord.coins === 'number') {
            console.log('Debug: Realtime coin update received:', newRecord.coins);
            this.notifySubscribers(newRecord.coins);
          }
        }
      )
      .subscribe();
  }

  subscribe(callback: (coins: number) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(coins: number) {
    this.subscribers.forEach(callback => callback(coins));
  }

  async incrementCoins(amount: number): Promise<void> {
    const browserId = getBrowserId();
    console.log('Debug: Attempting to increment coins by:', amount);
    
    try {
      // First, ensure the player exists
      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('coins')
        .eq('browser_id', browserId)
        .single();

      if (playerError) {
        console.error('Debug: Error fetching player:', playerError);
        // Create new player if doesn't exist
        const { error: createError } = await supabase
          .from('players')
          .insert([{ browser_id: browserId, coins: 0 }]);
          
        if (createError) throw createError;
      }

      // Immediate processing for coin increment
      const { error } = await supabase.rpc('increment_coins', {
        increment_amount: amount,
        user_telegram_id: browserId
      });

      if (error) {
        console.error('Debug: Error in direct increment:', error);
        this.queueOperation(browserId, amount);
        throw error;
      }
      
      console.log('Debug: Coins incremented successfully by:', amount);
    } catch (error) {
      console.error('Debug: Error in incrementCoins:', error);
      this.queueOperation(browserId, amount);
      throw error;
    }
  }

  private queueOperation(playerId: string, amount: number): void {
    console.log('Debug: Queueing operation:', { playerId, amount });
    this.operationQueue.push({ playerId, amount, retryCount: 0 });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.operationQueue.length === 0 || !navigator.onLine) {
      return;
    }

    this.isProcessing = true;
    console.log('Debug: Processing queue:', this.operationQueue.length, 'operations');

    try {
      while (this.operationQueue.length > 0) {
        const batch = this.operationQueue.slice(0, this.batchSize);
        const { error } = await supabase.rpc('batch_increment_coins', {
          user_ids: batch.map(op => op.playerId),
          amounts: batch.map(op => op.amount)
        });

        if (error) {
          console.error('Debug: Error processing batch:', error);
          
          // Process failed operations individually
          for (const op of batch) {
            try {
              await supabase.rpc('increment_coins', {
                increment_amount: op.amount,
                user_telegram_id: op.playerId
              });
            } catch (individualError) {
              if (op.retryCount < this.maxRetries) {
                op.retryCount++;
                setTimeout(() => {
                  this.queueOperation(op.playerId, op.amount);
                }, this.retryDelay * Math.pow(1.5, op.retryCount));
              } else {
                console.error('Debug: Max retries reached for operation:', op);
              }
            }
          }
        }

        this.operationQueue = this.operationQueue.slice(this.batchSize);
        
        if (this.operationQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const coinService = CoinService.getInstance();
