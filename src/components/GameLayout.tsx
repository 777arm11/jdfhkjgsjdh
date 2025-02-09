
import React, { useEffect } from 'react';
import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GameLayoutProps {
  score: number;
  highScore: number;
  coins: number;
  isPlaying: boolean;
  onScoreUpdate: (newScore: number) => void;
  onStart: () => void;
  onReset: () => void;
  telegramValidated?: boolean;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  score,
  highScore,
  coins,
  isPlaying,
  onScoreUpdate,
  onStart,
  onReset,
  telegramValidated = false
}) => {
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      console.log('Debug: Initializing Telegram WebApp');
      
      // Tell Telegram WebApp we're ready
      webApp.ready();
      console.log('Debug: WebApp ready called');
      
      // Expand to full screen
      webApp.expand();
      console.log('Debug: WebApp expanded');

      // Apply Telegram theme colors
      document.documentElement.style.setProperty('--game-primary', webApp.themeParams.bg_color);
      document.documentElement.style.setProperty('--game-text', webApp.themeParams.text_color);
      document.documentElement.style.setProperty('--game-accent', webApp.themeParams.button_color);
    } else {
      console.log('Debug: Telegram WebApp not found in window object');
    }
  }, []);

  // Display test mode warning if not in Telegram
  if (!telegramValidated && !window.Telegram?.WebApp) {
    console.log('Debug: Showing test mode UI. telegramValidated:', telegramValidated, 'window.Telegram:', window.Telegram);
    return (
      <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-game-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-game-secondary border-game-accent">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <CardTitle className="text-2xl font-pixel text-white text-center">
                Test Mode
              </CardTitle>
            </div>
            <CardDescription className="text-center text-base font-pixel text-white/80">
              Open this game in Telegram to play with full features.
              <div className="mt-2 text-sm opacity-70">
                Debug Info:
                <br />
                Telegram Object: {window.Telegram ? 'Present' : 'Missing'}
                <br />
                WebApp Object: {window.Telegram?.WebApp ? 'Present' : 'Missing'}
                <br />
                Validation: {telegramValidated ? 'Passed' : 'Failed'}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-4 px-4 py-2 bg-game-accent text-white rounded-md font-pixel hover:bg-game-accent/80 transition-colors"
            >
              Start Test Mode
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-game-primary">
      <div className="max-w-xl mx-auto h-full px-4 py-6 flex flex-col gap-6">
        <ScoreBoard currentScore={score} highScore={highScore} coins={coins} />
        <div className="flex-1 relative">
          <GameArea 
            isPlaying={isPlaying} 
            score={score} 
            onScoreUpdate={onScoreUpdate} 
          />
        </div>
        <div className="mb-16">
          <GameControls
            onStart={onStart}
            onReset={onReset}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
