import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read user data:", error);
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;