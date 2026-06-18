import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import BuyerAccount from "./pages/BuyerAccount";
import Marche from "./pages/Marche";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import NotreMission from "./pages/NotreMission";
import Confidentialite from "./pages/Confidentialite";
import CGU from "./pages/CGU";
import Cookies from "./pages/Cookies";
import MentionsLegales from "./pages/MentionsLegales";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import DevenirPartenaire from "./pages/DevenirPartenaire";
import QuiSommesNous from "./pages/QuiSommesNous";
import Carrieres from "./pages/Carrieres";
import BlogArticle from "./pages/BlogArticle";
import NosEngagements from "./pages/NosEngagements";
import Ressources from "./pages/Ressources";
import Gestion from "./pages/Gestion";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import CartDrawer from "./components/CartDrawer";
import BottomNav from "./components/BottomNav";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/marche" element={<PageTransition><Marche /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/produit/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/confirmation" element={<PageTransition><OrderConfirmation /></PageTransition>} />
        <Route path="/mes-commandes" element={<PageTransition><MyOrders /></PageTransition>} />
        <Route path="/mon-compte" element={<PageTransition><BuyerAccount /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/notre-mission" element={<PageTransition><NotreMission /></PageTransition>} />
        <Route path="/confidentialite" element={<PageTransition><Confidentialite /></PageTransition>} />
        <Route path="/cgu" element={<PageTransition><CGU /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />
        <Route path="/mentions-legales" element={<PageTransition><MentionsLegales /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/devenir-partenaire" element={<PageTransition><DevenirPartenaire /></PageTransition>} />
        <Route path="/qui-sommes-nous" element={<PageTransition><QuiSommesNous /></PageTransition>} />
        <Route path="/carrieres" element={<PageTransition><Carrieres /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogArticle /></PageTransition>} />
        <Route path="/nos-engagements" element={<PageTransition><NosEngagements /></PageTransition>} />
        <Route path="/ressources" element={<PageTransition><Ressources /></PageTransition>} />
        <Route path="/gestion" element={<Gestion />} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppShell = () => {
  const location = useLocation();
  const isGestion = location.pathname === "/gestion";
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Sonner position="top-center" offset="72px" />
      {!isGestion && <CartDrawer />}
      <AnimatedRoutes />
      {!isGestion && <BottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <WishlistProvider>
              <CartProvider>
                <AppShell />
              </CartProvider>
            </WishlistProvider>
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
