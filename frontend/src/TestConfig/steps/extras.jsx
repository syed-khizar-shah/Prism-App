import { ColorSelector, SelectionCard } from "./FlowComponents";

const ExtrasStep = ({ extras, selectedExtras, selectedColors, onToggle, onColorSelect }) => (
  <div>
    <h2 className="font-semibold text-lg mb-4">Select Extras (Optional)</h2>
    <div className="space-y-4">
      {extras.map(extraItem => {
        const isSelected = selectedExtras.some(e => e._id === extraItem.extra._id);
        return (
          <div key={extraItem.extra._id} className="border rounded-lg p-4">
            <button
              className={`w-full p-4 rounded-lg border-2 text-left transition-all mb-3 ${isSelected
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              onClick={() => onToggle(extraItem.extra)}
            >
              <div className="font-medium">{extraItem.extra.name}</div>
              {extraItem.extra.description && (
                <div className="text-sm text-gray-600 mt-1">{extraItem.extra.description}</div>
              )}
              {extraItem.extra.price > 0 && (
                <div className="text-green-600 text-sm mt-1">+£{extraItem.extra.price}</div>
              )}
            </button>

            {isSelected && extraItem.colors?.length > 0 && (
              <ColorSelector
                colors={extraItem.colors}
                selectedColor={selectedColors[extraItem.extra._id]}
                onColorSelect={(color) => onColorSelect(extraItem.extra._id, color)}
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ExtrasStep