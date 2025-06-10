import { ColorSelector, SelectionCard } from "./FlowComponents";

// Step components
export const AgeGroupStep = ({ ageGroups, selectedAgeGroup, onSelect }) => (
  <div>
    <h2 className="font-semibold text-lg mb-4">Choose your age group</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ageGroups.map(ageGroup => (
        <SelectionCard
          key={ageGroup._id}
          item={ageGroup}
          isSelected={selectedAgeGroup?._id === ageGroup._id}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
);

export const LensTypeStep = ({ lensTypes, selectedLensType, onSelect }) => (
  <div>
    <h2 className="font-semibold text-lg mb-4">Choose your lens type</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lensTypes.map(lens => (
        <SelectionCard
          key={lens._id}
          item={lens}
          isSelected={selectedLensType?._id === lens._id}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
);

export const LensSubtypeStep = ({ lensSubtypes, selectedSubtype, selectedLensType, onSelect, onSkip }) => (
  <div>
    <h2 className="font-semibold text-lg mb-4">Choose {selectedLensType?.name}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {lensSubtypes.map(subtype => (
        <SelectionCard
          key={subtype._id}
          item={subtype}
          isSelected={selectedSubtype?._id === subtype._id}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
);

export const PowerMappingStep = ({ powerMappings, selectedRecommendedLens, onSelect }) => (
  <div>
    <h2 className="font-semibold text-lg mb-4">Select Power Range & Recommended Lens</h2>
    <div className="space-y-4">
      {powerMappings.map((map, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-gray-50">
          <div className="font-medium mb-3">Power Range: {map.min} - {map.max}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(map.recommendedLenses || []).map(lens => (
              <SelectionCard
                key={lens._id}
                item={lens}
                isSelected={selectedRecommendedLens?._id === lens._id}
                onSelect={(selectedLens) => onSelect(selectedLens, map)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DesignStep = ({ designs, selectedDesign, onSelect, onGoBack }) => {
  const visibleDesigns = designs.filter(design => design.isVisible !== false);

  if (visibleDesigns.length > 0) {
    return (
      <div>
        <h2 className="font-semibold text-lg mb-4">Choose a design</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleDesigns.map(design => (
            <SelectionCard
              key={design._id}
              item={design}
              isSelected={selectedDesign?._id === design._id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    );
  } else if (designs.length > 0) {
    return (
      <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">Design automatically selected. Proceeding to next step...</p>
      </div>
    );
  } else {
    return (
      <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">No designs available for this lens combination.</p>
        <button
          onClick={onGoBack}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Go Back
        </button>
      </div>
    );
  }
};

export const CoatingsStep = ({ coatings, selectedCoatings, onToggle }) => (
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

export const ExtrasStep = ({ extras, selectedExtras, selectedColors, onToggle, onColorSelect }) => (
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

export const SummaryStep = ({ totalPrice }) => (
  <div>
    <h2 className="font-semibold text-xl mb-6 text-green-600">Configuration Complete!</h2>
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-2xl font-bold text-green-700 mb-2">
          Total Price: £{totalPrice.toFixed(2)}
        </div>
        <p className="text-green-600">Ready to proceed with your order</p>
      </div>
    </div>
  </div>
);