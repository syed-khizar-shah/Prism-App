import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

export default function Navbar({ currentPath = "/" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const navigationItems = [
    { path: "/", label: "Dashboard" },
    { path: "/orders", label: "Orders" },
    { path: "/lenses", label: "Lenses" },
    { path: "/colors", label: "Colors" },
    { path: "/coatings", label: "Coatings" },
    { path: "/designs", label: "Designs" },
    { path: "/extras", label: "Extras" },
    { path: "/age-groups", label: "Age Groups" },
    { path: "/recommended-lenses", label: "Recommended Lenses" },
    { path: "/frame-summary-manager", label: "Frame Summary" },
    { path: "/promo-manager", label: "Promos" },
    { path: "/sight-tests", label: "Sight Tests" },
  ];

  const isActivePath = (itemPath) =>
    itemPath === "/" ? currentPath === "/" : currentPath.startsWith(itemPath);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center p-5 lg:px-8">
          {/* Logo / Brand */}
          <div className="text-lg font-bold text-gray-900">Admin Panel</div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                  isActivePath(item.path)
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 px-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActivePath(item.path)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={logout}
              className="w-full text-left py-2 px-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content being hidden under fixed navbar */}
      <div className="h-16" />
    </>
  );
}
