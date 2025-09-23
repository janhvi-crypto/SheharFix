import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as HotToaster } from 'react-hot-toast';
import { AppProvider } from "./contexts/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportIssue from "./pages/ReportIssue";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";
import PublicView from "./pages/PublicView";
import Transparency from "./pages/Transparency";
import NGOPartners from "./pages/NGOPartners";
import Profile from './pages/Profile';
import ManageIssues from './pages/ManageIssues';
import Heatmap from './pages/Heatmap';
import Chatbot from './components/Chatbot';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/public-view" element={<PublicView />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/ngo" element={<NGOPartners />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/manage-issues" element={<ManageIssues />} />
              <Route path="/heatmap" element={<Heatmap />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
          {/* Global Chatbot */}
          <Chatbot />
          
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
