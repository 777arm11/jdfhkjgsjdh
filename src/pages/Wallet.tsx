import React from 'react';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Wallet = () => {
  const referralLink = 'https://id-preview-668';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Referral Link',
        text: 'Join using my referral link!',
        url: referralLink,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to share. Try copying the link instead.",
      });
    }
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>
      
      <div className="space-y-4">
        <p className="text-gray-400">Referral link:</p>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-900 rounded-lg p-3 truncate">
            {referralLink}
          </div>
          <Button variant="outline" className="text-white border-gray-700" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
            Copy
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full text-white border-gray-700"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full text-white border-gray-700 mt-8"
        >
          Connect wallet
        </Button>
      </div>
    </div>
  );
};

export default Wallet;