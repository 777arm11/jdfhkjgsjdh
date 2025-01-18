import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Refer = () => {
  const { toast } = useToast();
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.id) {
      setTelegramId(tgUser.id.toString());
      setReferralCode(tgUser.id.toString());
    }
  }, []);

  const handleCopyReferralLink = async () => {
    if (!telegramId) {
      toast({
        title: "Error",
        description: "Please open this app in Telegram",
        variant: "destructive",
      });
      return;
    }

    const referralLink = `${window.location.origin}/refer/${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Success!",
        description: "Referral link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  const handleSaveWallet = async () => {
    if (!telegramId) {
      toast({
        title: "Error",
        description: "Please open this app in Telegram",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('players')
        .update({ wallet_address: walletAddress })
        .eq('telegram_id', telegramId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Wallet address saved successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save wallet address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <h1 className="text-2xl font-bold text-center mb-8">Refer Friends</h1>
      
      <div className="max-w-md mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Share Your Referral Link</h2>
          <p className="text-gray-600 mb-6">
            Invite your friends to join and earn rewards! You'll receive 100 coins for each friend who joins using your referral link.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-gray-900">Your Referral Code</p>
            <p className="text-lg font-mono mt-1">{referralCode || "Loading..."}</p>
          </div>
          
          <Button 
            onClick={handleCopyReferralLink}
            className="w-full flex items-center justify-center gap-2 bg-violet-400 hover:bg-violet-500"
            disabled={!telegramId}
          >
            <Link2 className="h-5 w-5" />
            Copy Referral Link
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Tonekeeper Wallet</h2>
          <p className="text-gray-600 mb-6">
            Add your Tonekeeper wallet address to receive rewards.
          </p>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your Tonekeeper wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            
            <Button 
              onClick={handleSaveWallet}
              className="w-full"
              disabled={!telegramId}
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