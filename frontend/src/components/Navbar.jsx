import { useState } from "react";

// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

export default function Navbar({ currentPath = "/" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  ];

  const isActivePath = (itemPath) => {
    if (itemPath === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="flex flex-col w-full">
        {/* Navbar Header and Menu Button */}


        {/* Desktop Navigation */}
        <div className="hidden lg:block  border-gray-200 w-full">
          <div className="flex flex-row w-full px-4 space-x-11 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium pb-3 border-b-2 transition-colors ${
                  isActivePath(item.path)
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 w-full px-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActivePath(item.path)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
