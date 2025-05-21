
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Rezervace from "./pages/Rezervace";
import Admin from "./pages/Admin";
import AdminClients from "./pages/AdminClients";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { getSubdomain } from "./utils/subdomains";

const queryClient = new QueryClient();

const App = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    const currentSubdomain = getSubdomain();
    setSubdomain(currentSubdomain);
  }, []);

  // Render different routes based on subdomain
  const renderRoutes = () => {
    // If we're on the admin subdomain, show only admin routes
    if (subdomain === 'admin') {
      return (
        <>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </>
      );
    }
    
    // Main domain routes
    return (
      <>
        <Route path="/" element={<Index />} />
        <Route path="/rezervace" element={<Rezervace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="*" element={<NotFound />} />
      </>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Only show Navbar on the main domain, not on admin subdomain */}
          {subdomain !== 'admin' && <Navbar />}
          <Routes>
            {renderRoutes()}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
