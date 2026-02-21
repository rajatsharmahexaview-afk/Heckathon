import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import GrandparentDashboard from "./pages/GrandparentDashboard";
import GrandchildDashboard from "./pages/GrandchildDashboard";
import TrusteeDashboard from "./pages/TrusteeDashboard";
import GiftCreation from "./pages/GiftCreation";
import VoiceGiftCreation from "./pages/VoiceGiftCreation";
import EducationalContent from "./pages/EducationalContent";
import FamilyCoverage from "./pages/FamilyCoverage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/grandparent" element={<GrandparentDashboard />} />
        <Route path="/grandparent/create-gift" element={<GiftCreation />} />
        <Route path="/grandparent/voice-gift" element={<VoiceGiftCreation />} />
        <Route path="/grandparent/family" element={<FamilyCoverage />} />
        <Route path="/grandchild" element={<GrandchildDashboard />} />
        <Route path="/trustee" element={<TrusteeDashboard />} />
        <Route path="/educational" element={<EducationalContent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const AppRoutes = () => {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to={`/${currentUser.role === "grandparent" ? "grandparent" : currentUser.role === "grandchild" ? "grandchild" : "trustee"}`} replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
