import { ColorSelector, SelectionCard } from "./FlowComponents";

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

export default LensSubtypeStep