
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
    className={`rounded-lg border-2 transition-all h-36 ${
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}
    onClick={() => onSelect(item)}
  >
    {item.image ? (
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
          <div className="font-medium text-lg text-white">{item.name}</div>
        </div>
      </div>
    ) : (
      <div className="font-medium text-lg">{item.name}</div>
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
      <div className="text-green-600">£{price || 0}</div>
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