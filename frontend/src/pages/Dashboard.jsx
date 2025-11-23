import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const sections = [
    { label: "Orders", description: "Manage customer orders", path: "/orders" },
    { label: "Lenses", description: "Lens management", path: "/lenses" },
    { label: "Colors", description: "Manage lens colors", path: "/colors" },
    { label: "Coatings", description: "Configure coatings", path: "/coatings" },
    { label: "Designs", description: "Lens designs", path: "/designs" },
    { label: "Extras", description: "Add lens extras", path: "/extras" },
    { label: "Age Groups", description: "Manage age categories", path: "/age-groups" },
    { label: "Recommended Lenses", description: "Configure recommendations", path: "/recommended-lenses" },
    { label: "Frame Summary", description: "Summary of frames", path: "/frame-summary-manager" },
    { label: "Promos", description: "Manage promotions", path: "/promo-manager" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your lens catalog, designs, and configurations
          </p>
        </div>
      </header>

      {/* Sections */}
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.label}
            onClick={() => navigate(section.path)}
            className="cursor-pointer rounded-xl shadow-md border-2 border-gray-200 p-6 hover:border-black transition duration-300"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-wide">{section.label}</h2>
            <p className="text-gray-500">{section.description}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
