import { Link } from 'react-router-dom';
import { GameController, Coins, Award, Link2, Code } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex flex-col items-center justify-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <GameController className="h-6 w-6" />
            <span className="text-xs">Game</span>
          </Link>
          
          <Link 
            to="/earn" 
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Coins className="h-6 w-6" />
            <span className="text-xs">Earn</span>
          </Link>
          
          <Link 
            to="/leaderboard" 
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Award className="h-6 w-6" />
            <span className="text-xs">Leaderboard</span>
          </Link>
          
          <Link 
            to="/refer" 
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Link2 className="h-6 w-6" />
            <span className="text-xs">Refer</span>
          </Link>
          
          <Link 
            to="/code" 
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Code className="h-6 w-6" />
            <span className="text-xs">Code</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;