import { SelectionCard } from "./FlowComponents";

// Step components
const AgeGroupStep = ({ ageGroups, selectedAgeGroup, onSelect }) => (
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

export default AgeGroupStep