import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { GlobalCoinsProvider } from "@/contexts/GlobalCoinsContext";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 5, // 5 minutes
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
            </Routes>
            <Toaster />
          </div>
        </Router>
      </GlobalCoinsProvider>
    </QueryClientProvider>
  );
}

export default App;