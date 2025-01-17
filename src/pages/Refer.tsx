import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link2 } from "lucide-react";

const Refer = () => {
  const { toast } = useToast();
  const referralCode = "USER123"; // This should be dynamically generated per user

  const handleCopyReferralLink = async () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Refer Friends</h1>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Share Your Referral Link</h2>
          <p className="text-gray-600 mb-6">
            Invite your friends to join and earn rewards! You'll receive 100 coins for each friend who joins using your referral link.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-gray-900">Your Referral Code</p>
            <p className="text-lg font-mono mt-1">{referralCode}</p>
          </div>
          
          <Button 
            onClick={handleCopyReferralLink}
            className="w-full flex items-center justify-center gap-2"
          >
            <Link2 className="h-5 w-5" />
            Copy Referral Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Refer;