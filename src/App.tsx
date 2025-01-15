import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Earn from "./pages/Earn";
import Profile from "./pages/Profile";
import Puzzle from "./pages/Puzzle";
import Wallet from "./pages/Wallet";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;