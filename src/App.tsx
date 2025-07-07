import { Suspense } from "react";
import { Route, Routes, useRoutes, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Forum from "./pages/forum";
import Profile from "./pages/profile";
import Collections from "./pages/collections";
import Marketplace from "./pages/marketplace";
import MarketplaceSell from "./pages/marketplace-sell";
import MyShop from "./pages/my-shop";
import MarketplaceSambat from "./pages/marketplace-sambat";
import MarketplaceSambatCreate from "./pages/marketplace-sambat-create";
import MarketplaceSambatDetail from "./pages/marketplace-sambat-detail";
import MarketplaceProduct from "./pages/marketplace-product";
import MarketplaceWishlist from "./pages/marketplace-wishlist";
import MyOrders from "./pages/my-orders";
import SellerOrders from "./pages/seller-orders";
import Admin from "./pages/admin";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import Kursus from "./pages/kursus";
import CourseDetail from "./pages/course-detail";
import LessonPage from "./pages/lesson";
import Database from "./pages/database";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Polling from "./pages/polling";
import FAQ from "./pages/faq";
import Help from "./pages/help";
import Onboarding from "./pages/onboarding";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ResetPassword from "./pages/reset-password";
import OrderReviewPage from "./pages/order-review";
import OrderDetail from "./pages/order-detail";
import MarketplaceCheckout from "./pages/marketplace-checkout";
import CartPage from "./pages/cart";
import Messages from "./pages/messages";
import Leaderboard from "./pages/leaderboard";

import Settings from "./pages/settings";
import { Toaster } from "@/components/ui/toaster";
import NotificationListener from "@/components/notification-listener";
import OfflineBanner from "@/components/offline-banner";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:category" element={<Forum />} />
            <Route path="/thread/:id" element={<Forum />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/u/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route
              path="/marketplace/product/:id"
              element={<MarketplaceProduct />}
            />
            <Route path="/marketplace/wishlist" element={<MarketplaceWishlist />} />
            <Route path="/marketplace/orders" element={<MyOrders />} />
            <Route path="/marketplace/sell" element={<MarketplaceSell />} />
            <Route path="/marketplace/my-shop" element={<MyShop />} />
            <Route path="/marketplace/add" element={<MarketplaceSell />} />
            <Route path="/marketplace/lapak" element={<MyShop />} />
            <Route path="/marketplace/lapak/orders" element={<SellerOrders />} />
            <Route path="/marketplace/lapak/orders/:id" element={<OrderDetail />} />
            <Route path="/marketplace/sambat" element={<MarketplaceSambat />} />
            <Route
              path="/marketplace/sambat/:id"
              element={<MarketplaceSambatDetail />}
            />
            <Route
              path="/marketplace/sambat/create"
              element={<MarketplaceSambatCreate />}
            />
            <Route path="/marketplace/cart" element={<CartPage />} />
            <Route
              path="/marketplace/checkout"
              element={<MarketplaceCheckout />}
            />
            <Route path="/marketplace/order/:orderId" element={<OrderDetail />} />
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="/kursus" element={<Kursus />} />
            <Route path="/kursus/:id" element={<CourseDetail />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/database" element={<Database />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/polling" element={<Polling />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/bantuan" element={<Help />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/order/:orderId/review" element={<OrderReviewPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <OfflineBanner />
        <NotificationListener />
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
