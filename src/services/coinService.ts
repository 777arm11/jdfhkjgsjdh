
import { supabase } from '@/integrations/supabase/client';
import { getBrowserId } from '@/utils/browserUtils';

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
  private retryDelay: number = 200; // Reduced from 1000ms to 200ms
  private batchSize: number = 5; // Reduced from 10 to 5
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
          if (payload.new && typeof payload.new.coins === 'number') {
            this.notifySubscribers(payload.new.coins);
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
    
    try {
      // Optimistic update
      const { data: currentPlayer } = await supabase
        .from('players')
        .select('coins')
        .eq('browser_id', browserId)
        .single();

      if (currentPlayer) {
        this.notifySubscribers(currentPlayer.coins + amount);
      }

      // Immediate processing for single operations
      const { error } = await supabase.rpc('increment_coins', {
        increment_amount: amount,
        user_telegram_id: browserId
      });

      if (error) {
        console.error('Debug: Error in direct increment:', error);
        this.queueOperation(browserId, amount);
        throw error;
      }
      
      console.log('Debug: Coins incremented successfully');
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
                }, this.retryDelay * Math.pow(1.5, op.retryCount)); // Using 1.5 instead of 2 for faster retries
              } else {
                console.error('Debug: Max retries reached for operation:', op);
              }
            }
          }
        }

        this.operationQueue = this.operationQueue.slice(this.batchSize);
        
        // Small delay between batches to prevent rate limiting
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
