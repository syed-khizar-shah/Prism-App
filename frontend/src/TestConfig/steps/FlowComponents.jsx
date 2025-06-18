
// Progress Bar Component
export const ProgressBar = ({ currentStep, totalSteps }) => (
  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    />
  </div>
);

// Selection Card Component
export const SelectionCard = ({ item, isSelected, onSelect, priceLabel = "£" }) => (
  <button
    className={`p-4 rounded-lg border-2 text-left transition-all ${
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}
    onClick={() => onSelect(item)}
  >
    <div className="font-medium text-lg">{item.name}</div>
    {item.description && (
      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
    )}
    {item.price > 0 && (
      <div className="text-green-600 text-sm mt-1">+{priceLabel}{item.price}</div>
    )}
  </button>
);

// Summary Item Component
export const SummaryItem = ({ label, name, price, bgColor = "bg-gray-50", extraInfo }) => (
  <div className={`flex justify-between items-center p-2 ${bgColor} rounded`}>
    <span className="font-medium">{label}:</span>
    <div className="text-right">
      <div>{name}</div>
      {extraInfo && <div className="text-xs text-gray-500">{extraInfo}</div>}
      {price && <div className="text-green-600">£{price || 0}</div>}
    </div>
  </div>
);

// Color Selection Component
export const ColorSelector = ({ colors, selectedColor, onColorSelect }) => (
  <div>
    <div className="text-sm font-medium mb-2">Select Color:</div>
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <button
          key={color._id}
          className={`px-3 py-2 rounded border text-sm flex items-center gap-2 transition-all ${
            selectedColor?._id === color._id
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white hover:bg-gray-50 border-gray-300'
          }`}
          onClick={() => onColorSelect(color)}
        >
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: color.code }}
          />
          {color.name}
        </button>
      ))}
    </div>
  </div>
);