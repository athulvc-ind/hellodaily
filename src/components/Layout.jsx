import {
  BarChart3,
  ChefHat,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  QrCode,
  Settings,
  ShoppingCart,
  Table2,
  User,
  UtensilsCrossed
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useZed } from "../state/ZedContext.jsx";
import { roleLabels } from "../utils/access.js";
import { formatMoney } from "../utils/format.js";

const navItems = [
  { to: "/customer", label: "Customer", icon: LayoutDashboard, roles: ["customer"] },
  { to: "/booking", label: "Book Table", icon: QrCode, roles: ["customer"] },
  { to: "/menu", label: "Menu", icon: MenuIcon, roles: ["customer", "admin"] },
  { to: "/checkout", label: "Checkout", icon: ShoppingCart, roles: ["customer"] },
  { to: "/tracking", label: "Tracking", icon: ClipboardList, roles: ["customer"] },
  { to: "/profile", label: "Profile", icon: User, roles: ["customer"] },
  { to: "/staff", label: "Staff", icon: CreditCard, roles: ["staff"] },
  { to: "/kitchen", label: "Kitchen", icon: ChefHat, roles: ["kitchen"] },
  { to: "/admin", label: "Admin", icon: Settings, roles: ["admin"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] }
];

export function Layout() {
  const { activeTable, analytics, cart, currentUser, logout, role } = useZed();
  const location = useLocation();
  const navigate = useNavigate();
  const visibleNav = navItems.filter((item) => item.roles.includes(role));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const canSeeRevenue = ["admin", "staff"].includes(role);

  const signOut = () => {
    const nextLoginPath = role === "customer" ? "/customer-login" : "/login";
    logout();
    navigate(nextLoginPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <p className="text-lg font-bold">HelloDaily</p>
                <p className="text-xs text-slate-500">Restaurant operations</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {visibleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-mint text-leaf"
                      : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            {role === "customer" && activeTable ? (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">Table session</p>
                <p className="mt-1 text-xl font-bold">{activeTable.tableNumber}</p>
                <p className="mt-1 text-xs text-slate-500">{activeTable.zone}</p>
              </>
            ) : null}
            {canSeeRevenue ? (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">Today revenue</p>
                <p className="mt-1 text-xl font-bold">{formatMoney(analytics.revenue)}</p>
              </>
            ) : null}
            {role === "kitchen" ? (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">Kitchen access</p>
                <p className="mt-1 text-xl font-bold">Live queue</p>
              </>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-auto min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                {roleLabels[role] || "Signed in"}
              </p>
              <p className="text-sm font-bold text-ink">{currentUser.name}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {role === "customer" && activeTable ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <Table2 size={17} />
                  {activeTable.tableNumber}
                </div>
              ) : null}
              {role === "customer" ? (
                <>
                  <NavLink
                    to="/checkout"
                    className={`secondary-button ${location.pathname === "/checkout" ? "border-leaf text-leaf" : ""}`}
                  >
                    <ShoppingCart size={17} />
                    Cart {cartCount ? `(${cartCount})` : ""}
                  </NavLink>
                  <NavLink to="/profile" className="icon-button" title="Profile">
                    <User size={18} />
                  </NavLink>
                </>
              ) : null}
              <button className="secondary-button" onClick={signOut}>
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {visibleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-mint text-leaf" : "bg-white text-slate-600"
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
