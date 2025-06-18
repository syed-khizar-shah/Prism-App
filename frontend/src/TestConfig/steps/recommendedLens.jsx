import { SelectionCard } from "./FlowComponents";

const RecommendedLensStep = ({ recommendedLenses, selectedRecommendedLens, onSelect }) => {
    console.log({recommendedLenses})
    return (

        <div>
            <h2 className="font-semibold text-lg mb-4">Select Recommended Lens</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(recommendedLenses || []).map(lens => (
                        <SelectionCard
                            key={lens._id}
                            item={lens}
                            isSelected={selectedRecommendedLens?._id === lens._id}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
};

export default RecommendedLensStep