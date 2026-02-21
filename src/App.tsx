import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HistoryRoute from "./pages/HistoryRoute";
import AnalyticsRoute from "./pages/AnalyticsRoute";
import AssistantRoute from "./pages/AssistantRoute";
import SafetyRoute from "./pages/SafetyRoute";
import SettingsRoute from "./pages/SettingsRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<HistoryRoute />} />
          <Route path="/analytics" element={<AnalyticsRoute />} />
          <Route path="/assistant" element={<AssistantRoute />} />
          <Route path="/safety" element={<SafetyRoute />} />
          <Route path="/settings" element={<SettingsRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
