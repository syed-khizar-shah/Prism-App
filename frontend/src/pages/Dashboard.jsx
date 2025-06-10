import { useState } from "react";
import Overview from "./Overview";

// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

// Mock ImageUploader component
const ImageUploader = () => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
    <p className="text-gray-500">Image uploader component would be rendered here</p>
  </div>
);

export default function Dashboard() {
  const [url, setUrl] = useState('');
  
  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/colors", label: "Colors", icon: "🎨" },
    { path: "/coatings", label: "Coatings", icon: "✨" },
    { path: "/extras", label: "Extras", icon: "➕" },
    { path: "/age-groups", label: "Age Groups", icon: "👥" },
    { path: "/recommended-lenses", label: "Recommended Lens", icon: "💡" },
    { path: "/lenses", label: "Lens", icon: "🔍" },
    { path: "/designs", label: "Designs", icon: "🎯" },
    { path: "/flow", label: "Admin Guide", icon: "❓" }

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Lens Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your lens catalog, designs, and configurations</p>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* System Overview */}
          <div className="lg:col-span-2">
            <Overview/>
          </div>

          {/* Navigation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-3">🧭</span>
                Navigation
              </h2>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 group"
                  >
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Quick Access
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Sections</span>
                    <span className="font-medium text-gray-900">{navigationItems.length - 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Uploader Section */}
        {url && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Upload</h2>
              <ImageUploader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}