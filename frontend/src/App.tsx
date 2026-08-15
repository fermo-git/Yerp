import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { LandingPage } from "@/pages/LandingPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

import { MarketplacePage } from "@/pages/MarketplacePage";
import { MarketplaceListingDetailPage } from "@/pages/MarketplaceListingDetailPage";
import { RestaurantsPage } from "@/pages/RestaurantsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explorar" element={<PlaceholderPage title="Explorar negocios" />} />
          <Route path="/eventos" element={<PlaceholderPage title="Eventos" />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/restaurantes" element={<RestaurantsPage />} />
          <Route path="/marketplace/:slug" element={<MarketplaceListingDetailPage />} />
          <Route path="/negocios/nuevo" element={<PlaceholderPage title="Publica tu negocio" />} />
          <Route path="/negocios/:slug" element={<PlaceholderPage title="Detalle de negocio" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
