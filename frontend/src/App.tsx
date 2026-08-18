import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminBusinessesPage } from "@/pages/admin/AdminBusinessesPage";
import { AdminReviewsPage } from "@/pages/admin/AdminReviewsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { LandingPage } from "@/pages/LandingPage";
import { ExplorePage } from "@/pages/ExplorePage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { MarketplaceDetailPage } from "@/pages/MarketplaceDetailPage";
import { GaritaPage } from "@/pages/GaritaPage";
import { RestaurantsPage } from "@/pages/RestaurantsPage";
import { RestaurantDetailPage } from "@/pages/RestaurantDetailPage";
import { NewBusinessPage } from "@/pages/NewBusinessPage";
import { MyMarketplaceListingsPage } from "@/pages/MyMarketplaceListingsPage";
import { ProfilePage } from "@/pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/eventos" element={<PlaceholderPage title="Eventos" />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/mias" element={<MyMarketplaceListingsPage />} />
          <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
          <Route path="/garitas" element={<GaritaPage />} />
          <Route path="/restaurantes" element={<RestaurantsPage />} />
          <Route path="/negocios/nuevo" element={<NewBusinessPage />} />
          <Route path="/negocios/:slug" element={<RestaurantDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="negocios" element={<AdminBusinessesPage />} />
            <Route path="resenas" element={<AdminReviewsPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}