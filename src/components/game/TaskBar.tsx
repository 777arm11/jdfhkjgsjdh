
import React from 'react';
import { Home, LayoutGrid, Settings, Star, Heart } from 'lucide-react';

interface TaskBarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const TaskBarItem: React.FC<TaskBarItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all ${
        active 
          ? 'text-white bg-purple-700/50' 
          : 'text-purple-300 hover:text-white hover:bg-purple-600/30'
      }`}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs font-pixel">{label}</span>
    </button>
  );
};

const TaskBar: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('game');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-purple-900/80 border-t border-purple-700 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex justify-between items-center">
          <TaskBarItem 
            icon={<Home className="w-full h-full" />} 
            label="Game"
            active={activeTab === 'game'}
            onClick={() => handleTabChange('game')}
          />
          <TaskBarItem 
            icon={<LayoutGrid className="w-full h-full" />} 
            label="Levels"
            active={activeTab === 'levels'}
            onClick={() => handleTabChange('levels')}
          />
          <TaskBarItem 
            icon={<Star className="w-full h-full" />} 
            label="High Score"
            active={activeTab === 'highscore'}
            onClick={() => handleTabChange('highscore')}
          />
          <TaskBarItem 
            icon={<Heart className="w-full h-full" />} 
            label="Themes"
            active={activeTab === 'themes'}
            onClick={() => handleTabChange('themes')}
          />
          <TaskBarItem 
            icon={<Settings className="w-full h-full" />} 
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => handleTabChange('settings')}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskBar;
