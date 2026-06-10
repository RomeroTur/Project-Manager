import { NavLink, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

type NavItem = { label: string; to: string };

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Users", to: "/admin/users" },
  { label: "Tasks", to: "/admin/tasks" },
];

const USER_NAV: NavItem[] = [
  { label: "My Projects", to: "/dashboard" },
  { label: "My Tasks", to: "/dashboard/tasks" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = user?.role === "admin" ? ADMIN_NAV : USER_NAV;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* ── Sidebar ── */}
      <aside className="flex w-56 flex-col border-r border-gray-800 bg-gray-900">
        {/* Logo / brand */}
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-lg font-semibold tracking-tight text-white">
            Taskflow
          </span>
          {user?.role === "admin" && (
            <span className="ml-2 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              Admin
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {nav.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                [
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-600/20 text-violet-300"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-gray-800 px-4 py-4">
          <p className="text-xs text-gray-500 truncate">
            {user?.firstname} {user?.lastname}
          </p>
          <p className="text-[11px] text-gray-600 truncate mb-3">{user?.email}</p>
          <button
            onClick={logout}
            className="w-full rounded-md bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
