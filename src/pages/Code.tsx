import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileCode2, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalCoins } from "@/contexts/GlobalCoinsContext";

const Code = () => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { totalCoins } = useGlobalCoins();

  const handleRedeemCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid creator code",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const urlParams = new URLSearchParams(window.location.search);
      const telegramId = urlParams.get('id');

      if (!telegramId) {
        toast({
          title: "Error",
          description: "Please open this app in Telegram",
          variant: "destructive",
        });
        return;
      }

      // Call the redeem_creator_code function
      const { data, error } = await supabase.rpc('redeem_creator_code', {
        user_telegram_id: telegramId,
        creator_code: code.toUpperCase()
      });

      if (error) throw error;

      if (data === -1) {
        toast({
          title: "Pool Depleted",
          description: "The global coin pool has been depleted. No more coins can be redeemed at this time.",
          variant: "destructive",
        });
        return;
      }

      if (data === 0) {
        toast({
          title: "Invalid Code",
          description: "This code is invalid or has been deactivated",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: `You've received ${data.toLocaleString()} coins from the code!`,
      });
      
      setCode("");
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast({
        title: "Error",
        description: "Failed to redeem code. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-8 min-h-screen bg-game-primary">
      <Card className="w-full max-w-2xl mx-auto bg-game-secondary border-game-accent">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <FileCode2 className="w-8 h-8 text-white" />
            <CardTitle className="text-3xl font-pixel text-white text-center">
              Redeem Code
            </CardTitle>
          </div>
          <CardDescription className="text-center text-base font-pixel text-white/80">
            Enter your content creator code below to receive special rewards
          </CardDescription>
          <div className="text-center text-sm font-pixel text-white/60">
            Remaining in pool: {totalCoins.toLocaleString()} coins
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input 
                placeholder="Enter code here..."
                className="h-12 text-lg text-center uppercase tracking-wider bg-game-accent border-game-accent text-white font-pixel placeholder:text-white/50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              className="w-full h-12 text-lg font-pixel group transition-all duration-300 hover:shadow-lg bg-game-accent hover:bg-game-accent/80 text-white disabled:opacity-50"
              variant="default"
              onClick={handleRedeemCode}
              disabled={isSubmitting}
            >
              <Gift className={`mr-2 h-5 w-5 transition-transform ${isSubmitting ? 'animate-spin' : 'group-hover:scale-110'}`} />
              {isSubmitting ? 'Redeeming...' : 'Redeem Rewards'}
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-game-accent rounded-lg">
            <h3 className="font-pixel text-sm text-white mb-2">How it works:</h3>
            <ul className="text-sm font-pixel text-white/80 space-y-2">
              <li>1. Get a code from your favorite content creator</li>
              <li>2. Enter the code in the input field above</li>
              <li>3. Click redeem to receive your rewards</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Code;