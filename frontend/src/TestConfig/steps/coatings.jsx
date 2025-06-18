import { ColorSelector, SelectionCard } from "./FlowComponents";

const CoatingsStep = ({ coatings, selectedCoatings, onToggle }) => (
  <div>
    <h2 className="font-semibold text-lg mb-4">Select Coatings (Optional)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {coatings.map(coating => (
        <button
          key={coating._id}
          className={`p-4 rounded-lg border-2 text-left transition-all ${selectedCoatings.some(c => c._id === coating._id)
            ? 'border-purple-500 bg-purple-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          onClick={() => onToggle(coating)}
        >
          <div className="font-medium">{coating.name}</div>
          {coating.description && (
            <div className="text-sm text-gray-600 mt-1">{coating.description}</div>
          )}
          {coating.price > 0 && (
            <div className="text-green-600 text-sm mt-1">+£{coating.price}</div>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default CoatingsStep