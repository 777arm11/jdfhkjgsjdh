import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Coins, Award, Link2, Code } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-game-primary border-t border-game-accent shadow-lg font-pixel md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/') ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Gamepad2 className="h-5 w-5" />
            <span className="text-[8px]">Game</span>
          </Link>
          
          <Link 
            to="/earn" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/earn') ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Coins className="h-5 w-5" />
            <span className="text-[8px]">Earn</span>
          </Link>
          
          <Link 
            to="/leaderboard" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/leaderboard') ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Award className="h-5 w-5" />
            <span className="text-[8px]">Leaderboard</span>
          </Link>
          
          <Link 
            to="/refer" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/refer') ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Link2 className="h-5 w-5" />
            <span className="text-[8px]">Refer</span>
          </Link>
          
          <Link 
            to="/code" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/code') ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Code className="h-5 w-5" />
            <span className="text-[8px]">Code</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;