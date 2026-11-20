
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import AccountDetails from "../pages/AccountDetails/AccountDetails";
import SavedAddresses from "../pages/SavedAddresses/SavedAddresses";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import TrackOrder from "../pages/TrackOrder/TrackOrder";

import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import ProductManagement from "../pages/Products/ProductManagement";
import Order from "../pages/Orders/Orders";
import AdminRoute from "../routes/AdminRoute";
import InventoryManagement from "../pages/Admin/InventoryManagement";
import BestSellersPage from "../pages/BestSellers/BestSellers";
import Collection from "../pages/Collection/Collection";
import AnnouncementManagement from "../pages/Admin/AnnouncementManagement";
import ReviewManagement from "../pages/Admin/ReviewManagement";

import TermsOfService from "../pages/Legal/TermsOfService";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import CouponManagement from "../pages/Admin/CouponManagement.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRouteContent />
    </BrowserRouter>
  );
}

function AppRouteContent() {
  return (
    <Routes>
      {/* CUSTOMER WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/best-sellers"
          element={<BestSellersPage />}
        />

        <Route
          path="/collection"
          element={<Collection />}
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="/account" element={<Profile />} />

        <Route
          path="/account-details"
          element={<AccountDetails />}
        />

        <Route
          path="/saved-addresses"
          element={<SavedAddresses />}
        />

        {/* FULL PRODUCT DETAILS PAGE */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/track-order"
          element={<TrackOrder />}
        />

        {/* LEGAL PAGES */}
        <Route
          path="/terms"
          element={<TermsOfService />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
      </Route>

      {/* CART AND CHECKOUT */}
      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />

      {/* ADMIN WEBSITE */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/products"
            element={<ProductManagement />}
          />

          <Route
            path="/admin/inventory"
            element={<InventoryManagement />}
          />

          <Route
            path="/admin/orders"
            element={<Order />}
          />

          <Route
            path="/admin/announcements"
            element={<AnnouncementManagement />}
          />

          <Route
            path="/admin/reviews"
            element={<ReviewManagement />}
          />

          <Route
            path="/admin/coupons"
            element={<CouponManagement />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
