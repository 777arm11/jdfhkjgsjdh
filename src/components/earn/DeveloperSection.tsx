import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const DeveloperSection = () => {
  const { toast } = useToast();
  const [videoLink, setVideoLink] = useState("");
  const [videoCode, setVideoCode] = useState("");

  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoLink || !videoCode) {
      toast({
        title: "Error",
        description: "Please provide both video link and code",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Video details submitted successfully!",
    });
    setVideoLink("");
    setVideoCode("");
  };

  return (
    <form onSubmit={handleSubmitVideo} className="mt-6 space-y-4 border-t pt-6">
      <div className="bg-yellow-50 p-3 rounded-md mb-4">
        <p className="text-sm text-yellow-800">Developer Section</p>
      </div>
      <div>
        <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
          Video Link
        </label>
        <Input
          id="videoLink"
          type="url"
          placeholder="Enter video link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="videoCode" className="block text-sm font-medium text-gray-700 mb-1">
          Video Code
        </label>
        <Input
          id="videoCode"
          type="text"
          placeholder="Enter video code"
          value={videoCode}
          onChange={(e) => setVideoCode(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Video Details
      </Button>
    </form>
  );
};