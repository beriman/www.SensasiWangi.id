import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Forum from "./pages/forum";
import Profile from "./pages/profile";
import Marketplace from "./pages/marketplace";
import MarketplaceSell from "./pages/marketplace-sell";
import MarketplaceSambat from "./pages/marketplace-sambat";
import MarketplaceSambatCreate from "./pages/marketplace-sambat-create";
import Admin from "./pages/admin";
import Kursus from "./pages/kursus";
import Database from "./pages/database";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Polling from "./pages/polling";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/sell" element={<MarketplaceSell />} />
          <Route path="/marketplace/sambat" element={<MarketplaceSambat />} />
          <Route
            path="/marketplace/sambat/create"
            element={<MarketplaceSambatCreate />}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/kursus" element={<Kursus />} />
          <Route path="/database" element={<Database />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/polling" element={<Polling />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
