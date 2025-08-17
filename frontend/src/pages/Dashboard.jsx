import { useState } from "react";


export default function Dashboard() {
  const [url, setUrl] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Lens Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your lens catalog, designs, and configurations</p>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to Optix Admin
              </h2>
              <p className="text-gray-600 mb-6">
                Use the navigation bar above to manage different aspects of your lens business.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">Colors</div>
                  <div className="text-gray-500">Manage lens colors</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Coatings</div>
                  <div className="text-gray-500">Configure coatings</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Lenses</div>
                  <div className="text-gray-500">Lens management</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Designs</div>
                  <div className="text-gray-500">Lens designs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <div className="font-medium text-gray-900">Add New Lens</div>
                  <div className="text-sm text-gray-500">Create a new lens entry</div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-500">Check system statistics</div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <div className="font-medium text-gray-900">Settings</div>
                  <div className="text-sm text-gray-500">Configure system</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}