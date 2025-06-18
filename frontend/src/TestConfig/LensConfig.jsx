import { useEffect, useState } from "react";
import { ColorSelector, ProgressBar, SelectionCard, SummaryItem } from "./steps/FlowComponents";
import { LensDataService } from "./services/lensDataService";
import { useSelections } from "./hooks/useSelections";
import { useLensData } from "./hooks/useLensData";
import { useStepNavigation } from "./hooks/useStepNavigation";
import AgeGroupStep from "./steps/ageGroup";
import LensSubtypeStep from "./steps/lensSubType";
import LensTypeStep from "./steps/lensType";
import PowerMappingStep from "./steps/powerMap";
import RecommendedLensStep from "./steps/recommendedLens"; // New component for step 5
import DesignStep from "./steps/designStep";
import CoatingsStep from "./steps/coatings";
import ExtrasStep from "./steps/extras";
import SummaryStep from "./summary";


// Main Component
export default function LensConfig() {
  const { selections,
    selectedColors,
    updateSelection,
    resetSelectionsFrom,
    toggleCoating,
    toggleExtra,
    handleColorSelect,
    calculateTotalPrice } = useSelections();

  const { data, handleSkipSubtype, fetchDesigns } = useLensData(
    selections,
    updateSelection,
    resetSelectionsFrom
  );

  const {
    currentStep,
    totalSteps,
    getStepTitle,
    canProceed,
    goToStep,
    handleNext,
    handlePrev
  } = useStepNavigation(selections, data);

  // Selection handlers
  const handleAgeGroupSelect = (ageGroup) => {
    updateSelection("ageGroup", ageGroup);
    resetSelectionsFrom(1);
  };

  const handleLensTypeSelect = (lensType) => {
    updateSelection("lensType", lensType);
    resetSelectionsFrom(2);
  };

  const handleLensSubtypeSelect = (lensSubtype) => {
    updateSelection("lensSubtype", lensSubtype);
    resetSelectionsFrom(3);
  };

  // Separate handlers for power range and recommended lens
  const handlePowerRangeSelect = (powerMap) => {
    updateSelection("powerMap", powerMap);
    console.log({ powerMap })
    resetSelectionsFrom(4);
  };

  const handleRecommendedLensSelect = (recommendedLens) => {
    updateSelection("recommendedLens", recommendedLens);
    resetSelectionsFrom(5);
    fetchDesigns(recommendedLens);
  };

  const handleDesignSelect = (design) => {
    updateSelection("design", design);
    resetSelectionsFrom(6);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AgeGroupStep
          ageGroups={data.ageGroups}
          selectedAgeGroup={selections.ageGroup}
          onSelect={handleAgeGroupSelect} />;
      case 2:
        return <LensTypeStep
          lensTypes={data.lensTypes}
          selectedLensType={selections.lensType}
          onSelect={handleLensTypeSelect} />;
      case 3:
        return <LensSubtypeStep
          lensSubtypes={data.lensSubtypes}
          selectedSubtype={selections.lensSubtype}
          selectedLensType={selections.lensType}
          onSelect={handleLensSubtypeSelect}
          onSkip={handleSkipSubtype} />;
      case 4:
        return <PowerMappingStep
          powerMappings={data.powerMappings}
          selectedPowerMap={selections.powerMap}
          onSelect={handlePowerRangeSelect} />;
      case 5:
        return <RecommendedLensStep
          recommendedLenses={selections.powerMap.recommendedLenses}
          selectedRecommendedLens={selections.recommendedLens}
          onSelect={handleRecommendedLensSelect}
        />;
      case 6:
        return <DesignStep
          designs={data.designs}
          selectedDesign={selections.design}
          onSelect={handleDesignSelect}
          onGoBack={() => goToStep(5)} />;
      case 7:
        return selections.design?.coating?.length > 0 ? <CoatingsStep coatings={selections.design.coating} selectedCoatings={selections.coatings} onToggle={toggleCoating} /> : null;
      case 8:
        return selections.design?.extras?.length > 0 ? <ExtrasStep extras={selections.design.extras} selectedExtras={selections.extras} selectedColors={selectedColors} onToggle={toggleExtra} onColorSelect={handleColorSelect} /> : null;
      case 9:
        return <SummaryStep totalPrice={calculateTotalPrice()} />;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Lens Design Configurator</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Step {currentStep} of {totalSteps}:</span>
                <span className="font-medium">{getStepTitle()}</span>
              </div>
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Previous
              </button>

              {currentStep < totalSteps && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${!canProceed()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {(currentStep === 7 || currentStep === 8) ? 'Continue' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="sticky top-6">
            <h3 className="font-semibold text-lg mb-4">Configuration Summary</h3>

            {/* Price Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Total Price</div>
                <div className="text-2xl font-bold text-blue-700">£{calculateTotalPrice().toFixed(2)}</div>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="space-y-3 text-sm">
              {selections.ageGroup && (
                <SummaryItem
                  label="Age Group"
                  name={selections.ageGroup.name}
                />
              )}

              {selections.lensType && (
                <SummaryItem
                  label="Lens Type"
                  name={selections.lensType.name}
                  price={selections.lensType.price}
                />
              )}

              {selections.lensSubtype && (
                <SummaryItem
                  label="Lens Subtype"
                  name={selections.lensSubtype.name}
                  price={selections.lensSubtype.price}
                  bgColor="bg-indigo-50"
                />
              )}

              {selections.powerMap && (
                <SummaryItem
                  label="Power Range"
                  name={`${selections.powerMap.min} - ${selections.powerMap.max}`}
                  bgColor="bg-green-50"
                />
              )}

              {selections.recommendedLens && (
                <SummaryItem
                  label="Recommended Lens"
                  name={selections.recommendedLens.name}
                  price={selections.recommendedLens.price}
                  bgColor="bg-blue-50"
                />
              )}

              {selections.design && selections.design.isVisible && (
                <SummaryItem
                  label="Design"
                  name={selections.design.name}
                  price={selections.design.price}
                />
              )}

              {selections.coatings.map((coating, idx) => (
                <SummaryItem
                  key={idx}
                  label="Coating"
                  name={coating.name}
                  price={coating.price}
                  bgColor="bg-purple-50"
                />
              ))}

              {selections.extras.map((extra, idx) => (
                <SummaryItem
                  key={idx}
                  label="Extra"
                  name={extra.name}
                  price={extra.price}
                  bgColor="bg-orange-50"
                  extraInfo={selectedColors[extra._id] ? (`${selectedColors[extra._id].name}`) : ''}
                />
              ))}

              {!Object.values(selections).some(s => s) && (
                <div className="text-gray-500 text-center py-8">
                  Start configuring to see your selections here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}