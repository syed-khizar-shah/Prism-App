import { useEffect, useState } from "react";
import { ColorSelector, ProgressBar, SelectionCard, SummaryItem } from "./FlowComponents";
import { AgeGroupStep, CoatingsStep, DesignStep, ExtrasStep, LensSubtypeStep, LensTypeStep, PowerMappingStep, SummaryStep } from "./FlowSteps";
import { LensDataService } from "./services/lensDataService";


// Main Component
export default function LensConfigurator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    ageGroup: null,
    lensType: null,
    lensSubtype: null,
    powerMap: null,
    recommendedLens: null,
    design: null,
    coatings: [],
    extras: []
  });

  const [data, setData] = useState({
    ageGroups: [],
    lensTypes: [],
    lensSubtypes: [],
    powerMappings: [],
    designs: []
  });

  const [selectedColors, setSelectedColors] = useState({});
  const totalSteps = 8;

  // Calculate total price
  const totalPrice = () => {
    let price = 0;
    if (selections.ageGroup) price += selections.ageGroup.price || 0;
    if (selections.lensType) price += selections.lensType.price || 0;
    if (selections.lensSubtype) price += selections.lensSubtype.price || 0;
    if (selections.recommendedLens) price += selections.recommendedLens.price || 0;
    if (selections.design) price += selections.design.price || 0;
    selections.coatings.forEach(coating => price += coating.price || 0);
    selections.extras.forEach(extra => price += extra.price || 0);
    return price;
  };

  // Fetch age groups on mount
  useEffect(() => {
    const loadAgeGroups = async () => {
      const ageGroups = await LensDataService.fetchAgeGroups();
      setData(prev => ({ ...prev, ageGroups }));
    };
    loadAgeGroups();
  }, []);

  // Fetch main lens types when age group selected
  useEffect(() => {
    if (selections.ageGroup) {
      const loadLensTypes = async () => {
        const mainLensTypes = await LensDataService.fetchMainLensTypes(selections.ageGroup._id);
        setData(prev => ({ ...prev, lensTypes: mainLensTypes }));
      };
      loadLensTypes();
    }
  }, [selections.ageGroup]);

  // Fetch lens subtypes when main lens type selected
  useEffect(() => {
    if (selections.lensType && selections.ageGroup) {
      const loadLensSubtypes = async () => {
        const subtypes = await LensDataService.fetchLensSubtypes(
          selections.ageGroup._id,
          selections.lensType._id
        );
        setData(prev => ({ ...prev, lensSubtypes: subtypes }));

        // Auto-proceed if no subtypes available
        if (subtypes.length === 0) {
          handleSkipSubtype();
        }
      };
      loadLensSubtypes();
    }
  }, [selections.lensType, selections.ageGroup]);

  // Reset subsequent selections when going back
  const resetSelectionsFrom = (step) => {
    const resetMap = {
      1: ['lensType', 'lensSubtype', 'powerMap', 'recommendedLens', 'design', 'coatings', 'extras'],
      2: ['lensSubtype', 'powerMap', 'recommendedLens', 'design', 'coatings', 'extras'],
      3: ['powerMap', 'recommendedLens', 'design', 'coatings', 'extras'],
      4: ['design', 'coatings', 'extras'],
      5: ['coatings', 'extras'],
      6: ['extras']
    };

    const fieldsToReset = resetMap[step] || [];
    setSelections(prev => {
      const newSelections = { ...prev };
      fieldsToReset.forEach(field => {
        newSelections[field] = Array.isArray(prev[field]) ? [] : null;
      });
      return newSelections;
    });

    if (step <= 2) {
      setData(prev => ({ ...prev, lensSubtypes: [], powerMappings: [], designs: [] }));
    }
    if (step <= 3) {
      setData(prev => ({ ...prev, powerMappings: [], designs: [] }));
    }
    if (step <= 4) {
      setData(prev => ({ ...prev, designs: [] }));
    }
    setSelectedColors({});
  };

  // Selection handlers
  const handleAgeGroupSelect = (ageGroup) => {
    setSelections(prev => ({ ...prev, ageGroup }));
    resetSelectionsFrom(1);
    setCurrentStep(2);
  };

  const handleLensTypeSelect = (lensType) => {
    setSelections(prev => ({ ...prev, lensType }));
    resetSelectionsFrom(2);
    setCurrentStep(3);
  };

  const handleLensSubtypeSelect = (lensSubtype) => {
    setSelections(prev => ({ ...prev, lensSubtype }));
    resetSelectionsFrom(3);

    const selectedLens = lensSubtype || selections.lensType;
    const powerMappings = selectedLens.powerLensMap || [];
    setData(prev => ({ ...prev, powerMappings }));
    setCurrentStep(4);
  };

  const handleSkipSubtype = () => {
    const powerMappings = selections.lensType.powerLensMap || [];
    setData(prev => ({ ...prev, powerMappings }));
    setCurrentStep(4);
  };

  const handleRecommendedLensSelect = (recommendedLens, powerMap) => {
    setSelections(prev => ({ ...prev, recommendedLens, powerMap }));
    resetSelectionsFrom(4);
    fetchDesigns(recommendedLens);
  };

  const fetchDesigns = async (recommendedLens) => {
    const selectedLens = selections.lensSubtype || selections.lensType;
    if (!selectedLens || !recommendedLens) return;

    const designs = await LensDataService.fetchDesignsByLensPair(
      selectedLens._id,
      recommendedLens._id
    );

    setData(prev => ({ ...prev, designs }));

    const visibleDesigns = designs.filter(design => design.isVisible !== false);

    if (designs.length === 0) {
      setCurrentStep(8);
      return;
    }

    if (designs.length === 1 && visibleDesigns.length === 0) {
      const singleDesign = designs[0];
      setSelections(prev => ({ ...prev, design: singleDesign }));

      if (singleDesign.coating && singleDesign.coating.length > 0) {
        setCurrentStep(6);
      } else if (singleDesign.extras && singleDesign.extras.length > 0) {
        setCurrentStep(7);
      } else {
        setCurrentStep(8);
      }
    } else {
      setCurrentStep(5);
    }
  };

  const handleDesignSelect = (design) => {
    setSelections(prev => ({ ...prev, design }));
    resetSelectionsFrom(5);

    if (design.coating && design.coating.length > 0) {
      setCurrentStep(6);
    } else if (design.extras && design.extras.length > 0) {
      setCurrentStep(7);
    } else {
      setCurrentStep(8);
    }
  };

  const toggleCoating = (coating) => {
    setSelections(prev => ({
      ...prev,
      coatings: prev.coatings.find(c => c._id === coating._id)
        ? prev.coatings.filter(c => c._id !== coating._id)
        : [...prev.coatings, coating]
    }));
  };

  const toggleExtra = (extra) => {
    setSelections(prev => {
      const exists = prev.extras.find(e => e._id === extra._id);
      if (exists) {
        setSelectedColors(prevColors => {
          const newColors = { ...prevColors };
          delete newColors[extra._id];
          return newColors;
        });
        return {
          ...prev,
          extras: prev.extras.filter(e => e._id !== extra._id)
        };
      } else {
        return {
          ...prev,
          extras: [...prev.extras, extra]
        };
      }
    });
  };

  const handleColorSelect = (extraId, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [extraId]: color
    }));
  };

  const goToStep = (step) => {
    const steps = getVisibleSteps();
    if (steps.includes(step)) {
      setCurrentStep(step);
    }
  };


  const canProceed = () => {
    const requirements = {
      1: selections.ageGroup,
      2: selections.lensType,
      3: true,
      4: selections.recommendedLens,
      5: selections.design || (data.designs.length > 0 && data.designs.filter(d => d.isVisible !== false).length === 0),
      6: true,
      7: true,
      8: true
    };
    return requirements[currentStep];
  };

  const getStepTitle = () => {
    const titles = {
      1: "Select Age Group",
      2: "Select Lens Type",
      3: "Select Lens Subtype (Optional)",
      4: "Select Power Range & Recommended Lens",
      5: "Select a Design",
      6: "Select Coatings (Optional)",
      7: "Select Extras (Optional)",
      8: "Configuration Complete!"
    };
    return titles[currentStep];
  };

  const getVisibleSteps = () => {
    const steps = [1, 2];

    if (!selections.lensType) return steps;

    if (data.lensSubtypes.length > 0) {
      steps.push(3);
    }

    if (selections.lensType || selections.lensSubtype) {
      steps.push(4);
    }

    if (data.designs.length > 0) {
      const visibleDesigns = data.designs.filter(d => d.isVisible !== false);
      if (!(data.designs.length === 1 && visibleDesigns.length === 0)) {
        steps.push(5);
      }
    }

    if (selections.design?.coating?.length > 0) {
      steps.push(6);
    }

    if (selections.design?.extras?.length > 0) {
      steps.push(7);
    }

    steps.push(8);
    return steps;
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AgeGroupStep ageGroups={data.ageGroups} selectedAgeGroup={selections.ageGroup} onSelect={handleAgeGroupSelect} />;
      case 2:
        return <LensTypeStep lensTypes={data.lensTypes} selectedLensType={selections.lensType} onSelect={handleLensTypeSelect} />;
      case 3:
        return <LensSubtypeStep lensSubtypes={data.lensSubtypes} selectedSubtype={selections.lensSubtype} selectedLensType={selections.lensType} onSelect={handleLensSubtypeSelect} onSkip={handleSkipSubtype} />;
      case 4:
        return <PowerMappingStep powerMappings={data.powerMappings} selectedRecommendedLens={selections.recommendedLens} onSelect={handleRecommendedLensSelect} />;
      case 5:
        return <DesignStep designs={data.designs} selectedDesign={selections.design} onSelect={handleDesignSelect} onGoBack={() => goToStep(4)} />;
      case 6:
        return selections.design?.coating?.length > 0 ? <CoatingsStep coatings={selections.design.coating} selectedCoatings={selections.coatings} onToggle={toggleCoating} /> : null;
      case 7:
        return selections.design?.extras?.length > 0 ? <ExtrasStep extras={selections.design.extras} selectedExtras={selections.extras} selectedColors={selectedColors} onToggle={toggleExtra} onColorSelect={handleColorSelect} /> : null;
      case 8:
        return <SummaryStep totalPrice={totalPrice()} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const steps = getVisibleSteps();
    const index = steps.indexOf(currentStep);
    if (index !== -1 && index + 1 < steps.length) {
      setCurrentStep(steps[index + 1]);
    }
  };

  const handlePrev = () => {
    const steps = getVisibleSteps();
    const index = steps.indexOf(currentStep);
    if (index > 0) {
      setCurrentStep(steps[index - 1]);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
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
                  {(currentStep === 6 || currentStep === 7) ? 'Continue' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {/* <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="sticky top-6">
            <h3 className="font-semibold text-lg mb-4">Configuration Summary</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Total Price</div>
                <div className="text-2xl font-bold text-blue-700">£{totalPrice().toFixed(2)}</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {selections.ageGroup && (
                <SummaryItem
                  label="Age Group"
                  name={selections.ageGroup.name}
                  price={selections.ageGroup.price}
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
                  price={0} 
                  bgColor="bg-green-50"
                />
              )}

              {selections.recommendedLens && (
                <SummaryItem
                  label="Recommended"
                  name={selections.recommendedLens.name}
                  price={selections.recommendedLens.price}
                />
              )}

              {selections.design && (
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
        </div> */}
      </div>
    </div>
  );
}