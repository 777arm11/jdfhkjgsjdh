
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface WalletSectionProps {
  playerId: string;
}

export const WalletSection = ({ playerId }: WalletSectionProps) => {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");

  const handleSaveWallet = async () => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ wallet_address: walletAddress })
        .eq('id', playerId)
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Wallet address saved successfully",
      });
    } catch (err) {
      console.error('Error saving wallet:', err);
      toast({
        title: "Error",
        description: "Failed to save wallet address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-game-secondary rounded-lg shadow-md p-6 border border-game-accent">
      <h2 className="text-xl font-pixel text-white mb-4">Your Tonekeeper Wallet</h2>
      <p className="text-white/80 font-pixel text-sm mb-6">
        Add your Tonekeeper wallet address to receive rewards.
      </p>
      
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your Tonekeeper wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="bg-game-accent border-game-accent text-white font-pixel placeholder:text-white/50"
        />
        
        <Button 
          onClick={handleSaveWallet}
          className="w-full bg-game-accent hover:bg-game-accent/80 text-white font-pixel"
        >
          Save Wallet Address
        </Button>
      </div>
    </div>
  );
};
