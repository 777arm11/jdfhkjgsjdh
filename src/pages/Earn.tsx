import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoSection } from "@/components/earn/VideoSection";
import { DeveloperSection } from "@/components/earn/DeveloperSection";
import { SocialMediaSection } from "@/components/earn/SocialMediaSection";

const Earn = () => {
  const isDeveloper = process.env.NODE_ENV === 'development';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Earn Coins</h1>
      
      <Tabs defaultValue="social" className="max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="social" className="mt-6">
          <div className="grid gap-6">
            <VideoSection />
            {isDeveloper && <DeveloperSection />}
            <SocialMediaSection />
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              New earning opportunities will be available here soon. Stay tuned!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Earn;