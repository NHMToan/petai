import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AuthRoute } from "./components/routing/AuthRoute";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { adminNavItems, userNavItems } from "./data/navigation";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminResourcePage } from "./pages/admin/AdminResourcePage";
import { ClaimDevicePage } from "./pages/app/ClaimDevicePage";
import { AccountPage } from "./pages/app/AccountPage";
import { PetsPage } from "./pages/app/PetsPage";
import { SettingsPage } from "./pages/app/SettingsPage";
import { UserDashboardPage } from "./pages/app/UserDashboardPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LandingPage } from "./pages/marketing/LandingPage";
import { ShopLayout } from "./pages/shop/ShopLayout";
import { ShopBrowsePage } from "./pages/shop/ShopBrowsePage";
import { ShopProductPage } from "./pages/shop/ShopProductPage";

export default function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<ShopLayout />} path="/shop">
        <Route element={<ShopBrowsePage />} index />
        <Route element={<ShopProductPage />} path=":productId" />
      </Route>
      <Route element={<AuthRoute />}>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout navItems={userNavItems} role="USER" systemLabel="Primary Owner" title="Sentient Connection" />} path="/app">
          <Route element={<Navigate replace to="/app/dashboard" />} index />
          <Route element={<UserDashboardPage />} path="dashboard" />
          <Route element={<PetsPage />} path="pets" />
          <Route element={<SettingsPage />} path="pets/:petId" />
          <Route element={<ClaimDevicePage />} path="claim-device" />
          <Route element={<Navigate replace to="/app/account" />} path="settings" />
          <Route element={<AccountPage />} path="account" />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route element={<DashboardLayout navItems={adminNavItems} role="ADMIN" systemLabel="Super Administrator" title="Admin System" />} path="/admin">
          <Route element={<Navigate replace to="/admin/dashboard" />} index />
          <Route element={<AdminDashboardPage />} path="dashboard" />
          <Route element={<AdminOrdersPage />} path="orders" />
          <Route element={<AdminProductsPage />} path="products" />
          <Route element={<AdminResourcePage resource="devices" />} path="devices" />
          <Route element={<AdminResourcePage resource="pets" />} path="pets" />
          <Route element={<AdminResourcePage resource="users" />} path="users" />
          <Route element={<AdminResourcePage resource="voices" />} path="voices" />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
