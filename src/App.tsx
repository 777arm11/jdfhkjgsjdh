import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { GlobalCoinsProvider } from "@/contexts/GlobalCoinsContext";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Refer from "@/pages/Refer";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import Navigation from "@/components/Navigation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalCoinsProvider>
        <Router>
          <div className="min-h-screen pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/refer" element={<Refer />} />
              <Route path="/refer/:referralCode" element={<Refer />} />
              <Route path="/leaderboard" element={<LeaderboardSection />} />
            </Routes>
            <Navigation />
            <Toaster />
          </div>
        </Router>
      </GlobalCoinsProvider>
    </QueryClientProvider>
  );
}

export default App;