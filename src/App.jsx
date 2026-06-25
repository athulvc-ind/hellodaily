import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Layout } from "./components/Layout.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { CartCheckout } from "./pages/CartCheckout.jsx";
import { CustomerDashboard } from "./pages/CustomerDashboard.jsx";
import { CustomerLoginPage } from "./pages/CustomerLoginPage.jsx";
import { KitchenDashboard } from "./pages/KitchenDashboard.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { MenuPage } from "./pages/MenuPage.jsx";
import { OrderTracking } from "./pages/OrderTracking.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { ReportsPage } from "./pages/ReportsPage.jsx";
import { StaffDashboard } from "./pages/StaffDashboard.jsx";
import { TableBooking } from "./pages/TableBooking.jsx";
import { TableScanPage } from "./pages/TableScanPage.jsx";
import { useZed } from "./state/ZedContext.jsx";
import { roleHome } from "./utils/access.js";

const customerEntryPaths = new Set([
  "/",
  "/customer",
  "/booking",
  "/menu",
  "/checkout",
  "/tracking",
  "/profile"
]);

function loginPathFor(pathname) {
  return customerEntryPaths.has(pathname) ? "/customer-login" : "/login";
}

function RoleRedirect() {
  const { role } = useZed();
  return <Navigate to={roleHome[role] || "/customer-login"} replace />;
}

function RequireAuth({ allowedRoles, requireTable = false, children }) {
  const { activeTable, currentUser, role } = useZed();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={loginPathFor(location.pathname)} replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role] || "/customer-login"} replace />;
  }

  if (requireTable && role === "customer" && !activeTable) {
    return <Navigate to="/customer-login" replace state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/customer-login" element={<CustomerLoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/team-login" element={<Navigate to="/login" replace />} />
      <Route path="/scan/:tableId" element={<TableScanPage />} />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<RoleRedirect />} />
        <Route
          path="/customer"
          element={
            <RequireAuth allowedRoles={["customer"]} requireTable>
              <CustomerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/booking"
          element={
            <RequireAuth allowedRoles={["customer"]} requireTable>
              <TableBooking />
            </RequireAuth>
          }
        />
        <Route
          path="/menu"
          element={
            <RequireAuth allowedRoles={["customer", "admin"]} requireTable>
              <MenuPage />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth allowedRoles={["customer"]} requireTable>
              <CartCheckout />
            </RequireAuth>
          }
        />
        <Route
          path="/tracking"
          element={
            <RequireAuth allowedRoles={["customer"]} requireTable>
              <OrderTracking />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth allowedRoles={["customer"]} requireTable>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/staff"
          element={
            <RequireAuth allowedRoles={["staff"]}>
              <StaffDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/kitchen"
          element={
            <RequireAuth allowedRoles={["kitchen"]}>
              <KitchenDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ReportsPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/customer-login" replace />} />
    </Routes>
  );
}
