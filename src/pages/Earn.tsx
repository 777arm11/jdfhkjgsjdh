
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoSection } from "@/components/earn/VideoSection";
import { SocialMediaSection } from "@/components/earn/SocialMediaSection";

const Earn = () => {
  return (
    <div className="w-full min-h-screen bg-game-primary text-game-text font-pixel">
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Earn Coins</h1>
        
        <Tabs defaultValue="social" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-game-secondary">
            <TabsTrigger value="social" className="data-[state=active]:bg-game-accent">Social</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-game-accent">New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="mt-6">
            <div className="grid gap-6">
              <VideoSection />
              <SocialMediaSection />
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <div className="bg-game-secondary rounded-lg border-2 border-game-text p-6">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-game-text/80">
                New earning opportunities will be available here soon. Stay tuned!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Earn;
