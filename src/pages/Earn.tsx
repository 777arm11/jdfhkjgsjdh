
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyRewardsSection } from "@/components/earn/DailyRewardsSection";
import { VideoSection } from "@/components/earn/VideoSection";
import { SocialMediaSection } from "@/components/earn/SocialMediaSection";
import CreatorCodeRedemption from "@/components/CreatorCodeRedemption";
import { Gift, Calendar, Video, Share2 } from "lucide-react";
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

const Earn = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const { colorScheme } = useTelegramWebApp();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className={`min-h-screen bg-game-primary p-4 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-2xl font-pixel text-center text-white mb-6">Earn Coins</h1>
        
        <Card className="mb-6 bg-game-secondary border-game-accent">
          <CardHeader className="pb-2">
            <CardTitle className="font-pixel text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-400" />
              Redeem Creator Code
            </CardTitle>
            <CardDescription>
              Enter a creator's code to receive bonus coins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatorCodeRedemption />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="daily" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8 bg-game-secondary">
            <TabsTrigger value="daily" className="font-pixel">
              <div className="flex flex-col items-center gap-1">
                <Calendar className="h-4 w-4" />
                Daily
              </div>
            </TabsTrigger>
            <TabsTrigger value="videos" className="font-pixel">
              <div className="flex flex-col items-center gap-1">
                <Video className="h-4 w-4" />
                Videos
              </div>
            </TabsTrigger>
            <TabsTrigger value="social" className="font-pixel">
              <div className="flex flex-col items-center gap-1">
                <Share2 className="h-4 w-4" />
                Social
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-0">
            <DailyRewardsSection />
          </TabsContent>
          
          <TabsContent value="videos" className="mt-0">
            <VideoSection />
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <SocialMediaSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Earn;
