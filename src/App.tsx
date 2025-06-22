import { Suspense } from "react";
import { Route, Routes, useRoutes, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Forum from "./pages/forum";
import Profile from "./pages/profile";
import Collections from "./pages/collections";
import Marketplace from "./pages/marketplace";
import MarketplaceSell from "./pages/marketplace-sell";
import MarketplaceSambat from "./pages/marketplace-sambat";
import MarketplaceSambatCreate from "./pages/marketplace-sambat-create";
import MarketplaceSambatDetail from "./pages/marketplace-sambat-detail";
import Admin from "./pages/admin";
import Kursus from "./pages/kursus";
import Database from "./pages/database";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Polling from "./pages/polling";
import FAQ from "./pages/faq";
import Login from "./pages/login";
import Signup from "./pages/signup";
import OrderReviewPage from "./pages/order-review";
import { Toaster } from "@/components/ui/toaster";
import NotificationListener from "@/components/notification-listener";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/Forum" element={<Navigate to="/forum" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/sell" element={<MarketplaceSell />} />
          <Route path="/marketplace/sambat" element={<MarketplaceSambat />} />
          <Route
            path="/marketplace/sambat/:id"
            element={<MarketplaceSambatDetail />}
          />
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
          <Route path="/faq" element={<FAQ />} />
          <Route path="/order/:orderId/review" element={<OrderReviewPage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <NotificationListener />
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
