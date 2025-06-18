import { SelectionCard } from "./FlowComponents";

const DesignStep = ({ designs, selectedDesign, onSelect, onGoBack }) => {
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

export default DesignStep