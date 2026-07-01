import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Package2,
  LayoutDashboard,
  Boxes,
  History,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import useAuthStore from "../store/authStore";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to highlight the active menu item
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Package2 className="text-blue-500 mr-3" size={28} />
          <span className="font-bold text-xl tracking-wide">Smart ERP</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </Link>

          <Link
            to="/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/products") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <Boxes size={20} />
            <span className="font-medium">Inventory</span>
          </Link>

          <Link
            to="/history"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/history") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <History size={20} />
            <span className="font-medium">Audit Logs</span>
          </Link>

          <Link
            to="/requests"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/requests") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Purchase Requests</span>
          </Link>
        </nav>

        {/* User Profile & Logout at the bottom */}
        <div className="p-4 border-t border-slate-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "Staff Member"}
            </p>
            <p className="text-xs text-blue-400 mt-0.5">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm z-10">
          <h1 className="text-2xl font-semibold text-gray-800">
            {location.pathname === "/"
              ? "Dashboard Overview"
              : location.pathname.replace("/", "").charAt(0).toUpperCase() +
                location.pathname.slice(2)}
          </h1>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet /> {/* Child pages will magically render here! */}
        </div>
      </main>
    </div>
  );
}
