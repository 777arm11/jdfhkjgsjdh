
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
  private retryDelay: number = 1000;

  private constructor() {
    // Initialize and start processing queue
    this.processQueue();
    // Listen for online/offline events
    window.addEventListener('online', () => this.processQueue());
  }

  static getInstance(): CoinService {
    if (!CoinService.instance) {
      CoinService.instance = new CoinService();
    }
    return CoinService.instance;
  }

  async incrementCoins(amount: number): Promise<void> {
    const browserId = getBrowserId();
    
    try {
      console.log('Debug: Attempting to increment coins:', { browserId, amount });
      
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
      const batchSize = 10;
      while (this.operationQueue.length > 0) {
        const batch = this.operationQueue.slice(0, batchSize);
        const { error } = await supabase.rpc('batch_increment_coins', {
          user_ids: batch.map(op => op.playerId),
          amounts: batch.map(op => op.amount)
        });

        if (error) {
          console.error('Debug: Error processing batch:', error);
          batch.forEach(op => {
            if (op.retryCount < this.maxRetries) {
              op.retryCount++;
              setTimeout(() => {
                this.queueOperation(op.playerId, op.amount);
              }, this.retryDelay * Math.pow(2, op.retryCount));
            } else {
              console.error('Debug: Max retries reached for operation:', op);
            }
          });
        }

        this.operationQueue = this.operationQueue.slice(batchSize);
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const coinService = CoinService.getInstance();
