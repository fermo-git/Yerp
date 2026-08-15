import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { LandingPage } from "@/pages/LandingPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { MarketplaceDetailPage } from "@/pages/MarketplaceDetailPage";
import { GaritaPage } from "@/pages/GaritaPage";
import { RestaurantsPage } from "@/pages/RestaurantsPage";
import { RestaurantDetailPage } from "@/pages/RestaurantDetailPage";
import { NewBusinessPage } from "@/pages/NewBusinessPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explorar" element={<PlaceholderPage title="Explorar negocios" />} />
          <Route path="/eventos" element={<PlaceholderPage title="Eventos" />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
          <Route path="/garitas" element={<GaritaPage />} />
          <Route path="/restaurantes" element={<RestaurantsPage />} />
          <Route path="/negocios/nuevo" element={<NewBusinessPage />} />
          <Route path="/negocios/:slug" element={<RestaurantDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}