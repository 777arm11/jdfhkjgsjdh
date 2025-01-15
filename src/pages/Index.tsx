import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';

const Index = () => {
  const [score, setScore] = useState(620);
  const [farmTime, setFarmTime] = useState(69.7691000);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleTap = () => {
    if (!isPlaying) return;
    setScore(prev => prev + 1);
  };

  const handleFarm = () => {
    toast({
      title: "Farming...",
      description: "Your rewards are being collected!",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative p-4">
      {/* Version number */}
      <div className="absolute top-4 left-4 text-sm text-gray-400">
        V1.0
      </div>

      {/* Profile section */}
      <div className="flex items-center gap-4 mt-8">
        <div className="w-16 h-16 rounded-full border-2 border-white"></div>
        <div className="flex flex-col">
          <div className="text-lg">The Profile name</div>
          <div className="text-sm text-gray-400">#1</div>
          <div className="text-sm text-gray-400">620p</div>
        </div>
      </div>

      {/* Score display */}
      <div className="text-6xl font-bold my-12">
        {score}
      </div>

      {/* Tapping area */}
      <div 
        className="w-48 h-48 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
        onClick={handleTap}
      >
        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#374151_20%,#374151_80%,transparent_80%,transparent)]"></div>
          <svg 
            className="w-16 h-16 text-white" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M22.1 15.1L20.8 14.7C20.3 14.5 19.8 14.8 19.6 15.3L19 17.1C18.8 17.6 19.1 18.1 19.6 18.3L20.9 18.7C21.4 18.9 21.9 18.6 22.1 18.1L22.7 16.3C22.9 15.8 22.6 15.3 22.1 15.1ZM13.9 3.7L12.6 3.3C12.1 3.1 11.6 3.4 11.4 3.9L10.8 5.7C10.6 6.2 10.9 6.7 11.4 6.9L12.7 7.3C13.2 7.5 13.7 7.2 13.9 6.7L14.5 4.9C14.7 4.4 14.4 3.9 13.9 3.7ZM18.4 9.9L17.1 9.5C16.6 9.3 16.1 9.6 15.9 10.1L15.3 11.9C15.1 12.4 15.4 12.9 15.9 13.1L17.2 13.5C17.7 13.7 18.2 13.4 18.4 12.9L19 11.1C19.2 10.6 18.9 10.1 18.4 9.9Z"/>
          </svg>
        </div>
      </div>

      {/* Farm button and timer */}
      <div className="fixed bottom-20 left-0 right-0 flex items-center justify-center gap-4 px-4">
        <div className="bg-gray-900 rounded-full px-4 py-2 flex items-center gap-2">
          <svg 
            className="w-6 h-6" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>{farmTime.toFixed(7)}</span>
        </div>
        <button 
          onClick={handleFarm}
          className="bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
        >
          Farm
        </button>
      </div>
    </div>
  );
};

export default Index;