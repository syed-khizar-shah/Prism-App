import { Layers, Eye, Glasses, Users, Palette, PlusCircle, Shield } from "lucide-react";

const SchemaOverview = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">System Overview</h1>
      <p className="text-gray-700 text-base mb-6">
        This system manages lens products and their configurations for different user needs. Below is a simplified explanation of how each part connects, designed for non-technical users.
      </p>

      {/* Main Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Glasses className="text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-700">Lens</h2>
          </div>
          <p className="text-sm text-gray-700">
            A base product that defines the type of lens, its features, price, and the age groups it’s suitable for. Also links to power ranges and suggests matching Recommended Lenses.
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-700">Design</h2>
          </div>
          <p className="text-sm text-gray-700">
            The connecting point of lens type and recommened lens(slimming option) to coatings and extras. All designs are shown to user but if visibilty is set to false, then only its features like extras and coating are shown without the name of design.
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">Coating</h2>
          </div>
          <p className="text-sm text-gray-700">
            Extra layers or treatments added to a Design (e.g., anti-glare or scratch resistance).
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <PlusCircle className="text-red-600" />
            <h2 className="text-xl font-semibold text-red-700">Extras</h2>
          </div>
          <p className="text-sm text-gray-700">
            Optional add-ons like tints or filters that can be added to a Design. Each Extra may support different Colors.
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="text-yellow-600" />
            <h2 className="text-xl font-semibold text-yellow-700">Color</h2>
          </div>
          <p className="text-sm text-gray-700">
            Used to describe color options available for Extras.
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-indigo-600" />
            <h2 className="text-xl font-semibold text-indigo-700">Age Group</h2>
          </div>
          <p className="text-sm text-gray-700">
            Categories like children, adults, or seniors used to group Lenses by target user.
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-700">Recommended Lens</h2>
          </div>
          <p className="text-sm text-gray-700">
            Suggested lens options for specific power ranges. Linked to Lenses and optionally included in Designs.
          </p>
        </div>
      </div>

      {/* Flow Section */}
      <div className="mt-10 bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4">Basic Workflow</h3>
        <ol className="list-decimal list-inside text-gray-800 space-y-3">
          <li>
            <span className="font-medium">Create Lenses:</span> Define different lens types, age groups, and power-to-recommendation mappings.
          </li>
          <li>
            <span className="font-medium">Add Recommended Lenses:</span> Add detailed options linked by power ranges.
          </li>
          <li>
            <span className="font-medium">Create Designs:</span> Pick a base Lens, add coatings and extras with color options.
          </li>
          <li>
            <span className="font-medium">Mark Designs as Visible:</span> Only visible Designs are shown to users in the storefront.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default SchemaOverview;
