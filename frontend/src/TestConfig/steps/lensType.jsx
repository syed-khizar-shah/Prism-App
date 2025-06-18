import { SelectionCard } from "./FlowComponents";

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

export default LensTypeStep