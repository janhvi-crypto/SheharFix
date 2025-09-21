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
import ComingSoon from "./pages/ComingSoon";
import Profile from "./pages/Profile";
import PartnerApply from "./pages/PartnerApply";

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
              <Route path="/partner/apply" element={<PartnerApply />} />
              <Route path="/profile" element={<Profile />} />
              {/* Coming soon placeholders */}
              <Route path="/manage-issues" element={<ComingSoon title="Manage Issues" description="Assign, track and resolve issues. This admin feature is coming soon." />} />
              <Route path="/admin-analytics" element={<ComingSoon title="Admin Analytics" description="Deeper insights for administrators are coming soon." />} />
              <Route path="/heatmap" element={<ComingSoon title="City Heatmap" description="Geospatial clustering and hotspot visualization are coming soon." />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
