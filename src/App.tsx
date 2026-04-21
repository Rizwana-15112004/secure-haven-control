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
import { EmergencyAlertProvider, useEmergencyAlerts } from "@/contexts/EmergencyAlertContext";
import { VolunteerAlertProvider, useVolunteerAlert } from "@/contexts/VolunteerAlertContext";
import { VolunteerAlertOverlay } from "@/components/VolunteerAlertOverlay";
import { RadiusAlertModal } from "@/components/modals/RadiusAlertModal";
import { useOfflineSync } from './hooks/useOfflineSync';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { useEffect } from 'react';
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
// Also bridges staff SOS events from SSE into the admin's EmergencyAlertPanel
function GlobalAlertListener() {
  useRealtimeSync(); // Activate Global Real-time Sync
  useOfflineSync();  // Sync any pending offline SOS
  const { incomingAlert, dismissAlert, proximityAlert, dismissProximity, staffSosAlert, dismissStaffSos } = useVolunteerAlert();
  const { addAlert } = useEmergencyAlerts();

  // When a staff_sos SSE event arrives, push it into the admin's alert panel
  useEffect(() => {
    if (staffSosAlert) {
      addAlert({
        staffName: staffSosAlert.staffName,
        floor: staffSosAlert.floor,
        injured: staffSosAlert.injured,
        details: staffSosAlert.details,
      });
      dismissStaffSos(); // Clear so reconnects don't re-trigger
    }
  }, [staffSosAlert, addAlert, dismissStaffSos]);
  
  return (
    <>
      {incomingAlert && <VolunteerAlertOverlay alert={incomingAlert} onDismiss={dismissAlert} />}
      <RadiusAlertModal 
        isOpen={!!proximityAlert} 
        onClose={dismissProximity} 
        alertData={proximityAlert}
      />
    </>
  );
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
