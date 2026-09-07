import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Profile from "../pages/Profile/Profile";
import AccountDetails from "../pages/AccountDetails/AccountDetails";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ProductManagement from "../pages/Products/ProductManagement";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          {/* Profile page */}
          <Route path="/profile" element={<Profile />} />

          {/* Account page currently uses the existing Profile page */}
          <Route path="/account" element={<Profile />} />
          <Route path="/account-details" element={<AccountDetails />}/>
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/admin/products" element={<ProductManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;