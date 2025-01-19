import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { GlobalCoinsProvider } from "@/contexts/GlobalCoinsContext";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Navigation from "@/components/Navigation";
import Earn from "@/pages/Earn";
import Leaderboard from "@/pages/Leaderboard";
import Refer from "@/pages/Refer";
import Code from "@/pages/Code";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalCoinsProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/refer" element={<Refer />} />
              <Route path="/code" element={<Code />} />
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