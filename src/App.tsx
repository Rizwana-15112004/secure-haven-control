import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { HelpChat } from "@/components/chat/HelpChat";
import { EmergencyAlertProvider } from "@/contexts/EmergencyAlertContext";
import { VolunteerAlertProvider, useVolunteerAlert } from "@/contexts/VolunteerAlertContext";
import { VolunteerAlertOverlay } from "@/components/VolunteerAlertOverlay";
import { useOfflineSync } from './hooks/useOfflineSync';
import { useRealtimeSync } from './hooks/useRealtimeSync';
const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Renders the full-screen alert overlay on ALL connected devices
function GlobalAlertListener() {
  useRealtimeSync(); // Activate Global Real-time Sync
  const { incomingAlert, dismissAlert } = useVolunteerAlert();
  if (!incomingAlert) return null;
  return <VolunteerAlertOverlay alert={incomingAlert} onDismiss={dismissAlert} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <VolunteerAlertProvider>
        <EmergencyAlertProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {/* Global alert overlay — shows on every phone that has the app open */}
            <GlobalAlertListener />
            <BrowserRouter>
              <HelpChat />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </EmergencyAlertProvider>
      </VolunteerAlertProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
