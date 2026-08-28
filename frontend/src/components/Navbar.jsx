import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  Eye,
  Palette,
  Layers,
  Ruler,
  Puzzle,
  Users,
  Sparkles,
  FileStack,
  Megaphone,
  Glasses,
  FileCog,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

// Grouped navigation config
const navigationGroups = [
  {
    label: null, // ungrouped / top-level items
    items: [{ path: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    items: [
      { path: "/orders", label: "Orders", icon: ShoppingCart },
      { path: "/sight-tests", label: "Sight Tests", icon: Eye },
    ],
  },
  {
    label: "Catalog",
    items: [
      { path: "/lenses", label: "Lenses", icon: Glasses },
      { path: "/colors", label: "Colors", icon: Palette },
      { path: "/coatings", label: "Coatings", icon: Layers },
      { path: "/designs", label: "Designs", icon: Ruler },
      { path: "/extras", label: "Extras", icon: Puzzle },
      { path: "/age-groups", label: "Age Groups", icon: Users },
      { path: "/recommended-lenses", label: "Recommended Lenses", icon: Sparkles },
    ],
  },
  {
    label: "Management",
    items: [
      { path: "/frame-summary-manager", label: "Frame Summary", icon: FileStack },
      { path: "/promo-manager", label: "Promos", icon: Megaphone },
      { path: "/report-config", label: "Report Config", icon: FileCog },
    ],
  },
];

export default function Navbar({ currentPath = "/" }) {
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop expand/collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile drawer
  const [collapsedGroups, setCollapsedGroups] = useState({}); // per-group accordion
  const { logout } = useAuth();

  const isActivePath = (itemPath) =>
    itemPath === "/" ? currentPath === "/" : currentPath.startsWith(itemPath);

  const toggleGroup = (label) =>
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const active = isActivePath(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setIsMobileOpen(false)}
        title={isCollapsed ? item.label : undefined}
        className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        <Icon size={18} className="shrink-0" />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Brand + collapse toggle */}
      <div
        className={`flex items-center border-b border-gray-200 px-4 py-5 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <span className="text-lg font-bold text-gray-900 truncate">Admin Panel</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden flex items-center justify-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {navigationGroups.map((group, idx) => (
          <div key={group.label ?? `group-${idx}`}>
            {group.label && !isCollapsed && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
              >
                <span>{group.label}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    collapsedGroups[group.label] ? "-rotate-90" : ""
                  }`}
                />
              </button>
            )}
            {group.label && isCollapsed && (
              <div className="my-2 border-t border-gray-200" />
            )}
            {!collapsedGroups[group.label] && (
              <div className="mt-1 space-y-1">
                {group.items.map(renderNavItem)}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={logout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-40 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        <span className="text-lg font-bold text-gray-900">Admin Panel</span>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Menu size={22} />
        </button>
      </div>
      {/* Spacer for mobile top bar */}
      <div className="h-14 lg:hidden" />

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col transition-transform duration-200 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop fixed sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 z-40 h-full ${sidebarWidth} bg-white border-r border-gray-200 flex-col transition-all duration-200`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop spacer to push page content right of the fixed sidebar */}
      <div className={`hidden lg:block ${sidebarWidth} shrink-0 transition-all duration-200`} />
    </>
  );
}