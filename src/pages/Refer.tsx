
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Refer = () => {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleCopyReferralLink = async () => {
    try {
      const referralLink = `https://game.example.com?ref=${referralCode}`;
      await navigator.clipboard.writeText(referralLink);
      
      toast({
        title: "Success!",
        description: "Referral link copied to clipboard!",
      });
    } catch (err) {
      console.error('Error handling referral:', err);
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  const handleSaveWallet = async () => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ wallet_address: walletAddress })
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
    <div className="container mx-auto px-4 py-8 mb-20 min-h-screen bg-game-primary">
      <h1 className="text-2xl font-pixel text-white text-center mb-8">Refer Friends</h1>
      
      <div className="max-w-md mx-auto space-y-8">
        <div className="bg-game-secondary rounded-lg shadow-md p-6 border border-game-accent">
          <h2 className="text-xl font-pixel text-white mb-4">Share Your Referral Link</h2>
          <p className="text-white/80 font-pixel text-sm mb-6">
            Invite your friends to join and earn rewards! You'll receive rewards for each friend who joins using your referral link.
          </p>
          
          <div className="bg-game-accent p-4 rounded-lg mb-6">
            <p className="text-sm font-pixel text-white">Your Referral Code</p>
            <Input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter your referral code"
              className="bg-game-accent border-game-accent text-white font-pixel mt-2"
            />
          </div>
          
          <Button 
            onClick={handleCopyReferralLink}
            className="w-full flex items-center justify-center gap-2 bg-game-accent hover:bg-game-accent/80 text-white font-pixel"
          >
            <Link2 className="h-5 w-5" />
            Copy Referral Link
          </Button>
        </div>

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
      </div>
    </div>
  );
};

export default Refer;
