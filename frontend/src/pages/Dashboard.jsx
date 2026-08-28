import { useNavigate } from "react-router-dom";
import {
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
} from "lucide-react";

const actions = [
  { label: "Orders", path: "/orders", icon: ShoppingCart },
  { label: "Sight Tests", path: "/sight-tests", icon: Eye },
  { label: "Lenses", path: "/lenses", icon: Glasses },
  { label: "Colors", path: "/colors", icon: Palette },
  { label: "Coatings", path: "/coatings", icon: Layers },
  { label: "Designs", path: "/designs", icon: Ruler },
  { label: "Extras", path: "/extras", icon: Puzzle },
  { label: "Age Groups", path: "/age-groups", icon: Users },
  { label: "Recommended Lenses", path: "/recommended-lenses", icon: Sparkles },
  { label: "Frame Summary", path: "/frame-summary-manager", icon: FileStack },
  { label: "Promos", path: "/promo-manager", icon: Megaphone },
  { label: "Report Config", path: "/report-config", icon: FileCog },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Quick actions</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 rounded-lg bg-white border border-gray-200 px-4 py-3 text-left shadow-sm hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition"
              >
                <Icon size={18} className="text-gray-500 shrink-0" />
                <span className="text-sm font-medium text-gray-800 truncate">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}