import React from 'react';
import { Youtube, Twitter, Instagram, Twitch, Music2, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

const missions = [
  { id: 1, icon: Youtube, points: 200, title: 'Mission #1' },
  { id: 2, icon: Twitter, points: 200, title: 'Mission #2' },
  { id: 3, icon: Instagram, points: 300, title: 'Mission #3' },
  { id: 4, icon: Twitch, points: 150, title: 'Mission #4' },
  { id: 5, icon: Music2, points: 400, title: 'Mission #5' },
  { id: 6, icon: Facebook, points: 300, title: 'Mission #6' },
];

const Earn = () => {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Earn</h1>
      <div className="flex gap-2 mb-6">
        <Button variant="outline" className="text-white border-gray-700">New</Button>
        <Button variant="outline" className="text-white border-gray-700">Socials</Button>
      </div>
      <div className="space-y-4">
        {missions.map((mission) => (
          <div key={mission.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              <mission.icon className="w-6 h-6" />
              <div>
                <h3 className="font-medium">{mission.title}</h3>
                <span className="text-green-400">+{mission.points}P</span>
              </div>
            </div>
            <Button variant="outline" className="text-white border-gray-700">
              Start
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earn;