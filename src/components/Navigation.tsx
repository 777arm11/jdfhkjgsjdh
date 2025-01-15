import { Link, useLocation } from 'react-router-dom';
import { Puzzle, Coins, Globe, Wallet as WalletIcon } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link to="/puzzle" className={`flex flex-col items-center ${location.pathname === '/puzzle' ? 'text-white' : 'text-gray-500'}`}>
          <Puzzle size={24} />
        </Link>
        <Link to="/earn" className={`flex flex-col items-center ${location.pathname === '/earn' ? 'text-white' : 'text-gray-500'}`}>
          <Coins size={24} />
        </Link>
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-white' : 'text-gray-500'}`}>
          <Globe size={24} />
        </Link>
        <Link to="/wallet" className={`flex flex-col items-center ${location.pathname === '/wallet' ? 'text-white' : 'text-gray-500'}`}>
          <WalletIcon size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;